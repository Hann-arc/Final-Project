const express = require("express");
const app = express();
const port = 3001;
const hbs = require('hbs');
const path = require('path');
const session = require("express-session");
const bcrypt = require("bcrypt");
const upload = require("./middleweres/upload-file");
const flash = require("express-flash");


hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

const userModel = require("./models").user;
const provinsiModel = require("./models").provinsi;
const kabupatenModel = require("./models").kabupaten;
app.use(express.urlencoded({ extended: true }));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(session({
    name: "my-session",
    secret: "4NHsbYgOWE",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge : 1000 * 60 * 60 * 24
    }
  }));
app.use(flash());

app.set("view engine", "hbs");
app.set("views", "4B/views");
app.use('/uploads', express.static("4B/uploads"));
app.use("/assets", express.static("4B/assets"));

app.get('/auth/login', renderLogin);
app.get('/auth/register', renderRegister);
app.get('/home', renderHome);
app.get('/detail/provinsi/:id', renderDetailProvinsi);
app.get('/detail/kabupaten/:id', renderDetailKabupaten);
app.get('/form/provinsi', renderProvinsi);
app.get('/form/kabupaten', renderKabupaten);
app.get('/delete-provinsi/:id', deleteProvinsi);
app.get('/delete-kabupaten/:id', deleteKabupaten);
app.post('/form/provinsi', upload.single("image"), addProvinsi);
app.post('/form/kabupaten', upload.single("image"), addKabupaten);
app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/edit-provinsi/:id', renderUpdateProvinsi);
app.get('/edit-kabupaten/:id', renderUpdateKabupaten);
app.post('/update-kabupaten/:id', upload.single("image"), updateKabupaten);






app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/home');
      }
      res.redirect('/auth/login');
    });
  });  


function renderLogin(req, res){
    res.render("login")
}

function renderRegister(req, res){
    res.render("register")
}

async function renderHome(req, res) {
    const user = req.session.user;

    try {
       
        const provinsiData = await provinsiModel.findAll({
            include: [{
                model: userModel,
                as: 'user',
                attributes: ['username'] 
            }],
        });

        const kabupatenData = await kabupatenModel.findAll();

       
        res.render("home", { 
            provinsis: provinsiData, 
            kabupatens: kabupatenData, 
            user: user 
        });
    } catch (error) {
        console.error("Error fetching data:", error); 
        res.status(500).send("Internal Server Error");
    }
}


async function renderDetailProvinsi(req, res){
    try {
        const { id } = req.params;
        const user = req.session.user

        const result = await provinsiModel.findOne({
            where: {
                id: id
            },
            include: [{
                model: userModel,
                as: 'user',
                attributes: ['username']
              }],
        })

        if (!result) {
            return res.status(404).send("Provinsi tidak ditemukan");
        }

        res.render("detail-provinsi", { provinsi: result, user: user, author: result.user});
        
    } catch (error) {
        console.log(error)
    }
    
}

async function renderDetailKabupaten(req, res){
    try {
    const { id } = req.params;
    const user = req.session.user

    const result = await kabupatenModel.findOne({
        where:{
            id: id
        }
    })
    if(!result){
        return res.send(error)
    }
    res.render("detail-kabupaten", { kabupaten: result, user: user })
    }
    catch (error) {
        console.log(error);
    }


}

function renderProvinsi(req, res){
    const user = req.session.user
    res.render("add-provinsi", { user })
}

async function renderKabupaten(req, res) {
    try {
        const user = req.session.user
        const provinsis = await provinsiModel.findAll();
       
        res.render("add-kabupaten", { provinsis, user });
    } catch (error) {
        console.error("Error fetching provinces:", error);
        req.flash("error", "An error occurred while fetching provinces.");
        res.redirect("/home");
    }
}



async function deleteProvinsi(req, res) {
    const { id } = req.params; 
    const user = req.session.user; 

    let provinsi = await provinsiModel.findOne({
        where: { id: id }
    });

    if (!user) {
        req.flash("error-delete-blog-user", "Unable to delete, please log in first."); 
        return res.redirect("/home");
    }
    if (!provinsi) {
        return res.status(404).send('Provinsi not found');
    }
    if (user.id !== provinsi.user_id) {
        req.flash("error-delete-blog-match-user", "You are not authorized to delete this provinsi."); 
        return res.redirect("/home");
    }

   
    await kabupatenModel.destroy({
        where: { provinsi_id: id }
    });

    await provinsiModel.destroy({ where: { id: id } });
    res.redirect("/home");
}


async function deleteKabupaten(req, res) {
    const { id } = req.params; 
    const user = req.session.user; 

    
    let kabupaten = await kabupatenModel.findOne({
        where: { id: id }
    });

    if (!user) {
        req.flash("error-delete-blog-user", "Unable to delete, please log in first."); 
        return res.redirect("/home");
    }
    if (!kabupaten) {
        return res.status(404).send('Kabupaten not found');
    }

    
    let provinsi = await provinsiModel.findOne({
        where: { id: kabupaten.provinsi_id }
    });

    if (user.id !== provinsi.user_id) {
        req.flash("error-delete-blog-match-user", "You are not authorized to delete this kabupaten."); 
        return res.redirect("/home");
    }


    await kabupatenModel.destroy({ where: { id: id } });
    res.redirect("/home");
}




async function addProvinsi(req, res) {
    try {
        const user = req.session.user.id;
        let { name, gubernur, populasi, pulau, diresmikan, description } = req.body;
        const image = req.file ? req.file.filename : null;

        await provinsiModel.create({
            user_id: user,
            name: name,
            diresmikan: diresmikan,
            image: image,
            pulau: pulau,
            gubernur: gubernur,
            populasi: populasi,
            description: description
        });
        res.redirect("/home");
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Error occurred while saving data.");
    }
}


async function addKabupaten(req, res) {
    try {
        const { name, diresmikan, bupati, populasi, description, provinsi_id } = req.body;
        const image = req.file ? req.file.filename : null; 
        if (!provinsi_id || isNaN(provinsi_id)) {
            req.flash("error", "Invalid province ID. Please select a valid province.");
            return res.redirect("/form/kabupaten");
        }

        await kabupatenModel.create({
            name,
            diresmikan,
            image,
            provinsi_id: parseInt(provinsi_id), 
            bupati,
            populasi,
            description
        });

        req.flash("success", "Kabupaten successfully added!");
        res.redirect("/home");
    } catch (error) {
        console.error("Error adding kabupaten:", error);
        req.flash("error", "An error occurred while adding kabupaten. Please try again.");
        res.redirect("/form/kabupaten");
    }
}


async function register(req, res) {
    try {
        const { name, email, password } = req.body;

       
        if (!email || !password || !name) {
            req.flash("error-register", "All fields are required.");
            return res.redirect("/auth/register");
        }


        const existingUser = await userModel.findOne({ where: { email: email } });
        if (existingUser) {
            req.flash("error-register", "Email is already registered.");
            return res.redirect("/auth/register");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await userModel.create({
            username: name,
            email: email,
            password: hashedPassword
        });

        req.flash("sukses-register", "Registration successful! Please log in.");
        res.redirect("/auth/login"); 

    } catch (error) {
        console.error("Error during registration:", error);
        req.flash("error-register", "Registration failed. Please try again.");
        res.redirect("/auth/register");
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            req.flash("error-user", "Email and password are required.");
            return res.redirect("/auth/login");
        }

        const user = await userModel.findOne({ where: { email: email } });

        if (!user) {
            req.flash("error-user", "Account not found");
            return res.redirect("/auth/login");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            req.flash("error-user", "Incorrect password");
            return res.redirect("/auth/login");
        }

        req.session.user = user;
        res.redirect("/home");

    } catch (error) {
        console.error("Error in login function:", error);
        req.flash("error-user", "Internal server error. Please try again later.");
        res.redirect("/auth/login");
    }
}

async function renderUpdateProvinsi(req, res) {
    const { id } = req.params
    const user = req.session.user
    const result = await provinsiModel.findOne({
        where:{
            id: id
        }
    })
    if(!user){
        req.flash("error-update-blog-user", "Unable to update, please log in first!") 
        res.redirect("/home");
        return
      }
      if (user.id !== result.user_id) {
        req.flash("error-update-blog-match-user", "You are not authorized to update this blog!");
        res.redirect("/home");
        return;
    }
  
      if (!result) {
        res.status(404).send('Blog not found');
          return;
      } 
        res.render('update', { dataProvinsi: result, user : user});
      
}

async function renderUpdateKabupaten(req, res) {
    const { id } = req.params;
  
    const user = req.session.user;



    try {
        const kabupaten = await kabupatenModel.findOne({
            where: { id: id },
            include: [{ model: provinsiModel, as: 'provinsi' }] 
        });

     

        if (!kabupaten) {
            return res.status(404).send('Kabupaten tidak ditemukan');
        }
        if (!user) {
            return res.redirect('/home');
        }
        const provinsiData = await provinsiModel.findAll();

        res.render('update-kabupaten', { dataKabupaten: kabupaten, provinsis: provinsiData,  });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan server');
    }
}



async function updateKabupaten(req, res) {
    const { id } = req.params;
    console.log("Update route reached with ID:", req.params.id)
    const { name, diresmikan, bupati, populasi, description, provinsi_id } = req.body;

    console.log('Received update request:', req.body);
    const image = req.file ? req.file.filename : null;

    try {
        
        await kabupatenModel.update({
            name,
            diresmikan,
            bupati,
            populasi,
            description,
            provinsi_id,
            image
        }, {
            where: { id: id }
        });

        req.flash("success", "Kabupaten updated successfully!");
        res.redirect("/home"); 
    } catch (error) {
        console.error("Error updating kabupaten:", error);
        req.flash("error", "An error occurred while updating kabupaten.");
        res.redirect(`/update-kabupaten/${id}`);  error
    }
}



app.listen(port, () =>{
    console.log(`Berjalan di port ${port}`)
})