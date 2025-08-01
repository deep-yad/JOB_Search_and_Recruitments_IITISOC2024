const express = require('express');
const router = express.Router();
const mysql=require('mysql')
const multer=require('multer')
const { readFile } = require('fs').promises;
router.use(express.json());
router.use(express.urlencoded({extended:false}));
const {  
    authenticateSeeker, 
    authenticateRecruiter 
} = require('./middleware.js');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'recruitment_project'
})
const { upload, upload2, upload3 } = require('./multerConfig.js');

db.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log('Connection with router3 Established!')
    }})

    let loginHtml = '',loginHtml9='',loginHtml10='',loginHtml11='', loginHtml1 = '',loginHtml12='';
    let  loginHtml2 = '', loginHtml3 = '', loginHtml4 = '', loginHtml5 = '', loginHtml6 = '', loginHtml7='',loginHtml8='';
    //to make the reading synchronous
    const readHtmlFiles = async () => {
        loginHtml = await readFile('./public/login_seeker.html', 'utf-8');
        loginHtml1 = await readFile('./public/login_recruiter.html', 'utf-8');
        loginHtml2 = await readFile('./public/signup_seeker.html', 'utf-8');
        loginHtml3 = await readFile('./public/signup_recruiter.html', 'utf-8');
        loginHtml4 = await readFile('./public/seekers_dashboard.html', 'utf-8');
        loginHtml5 = await readFile('./public/recruiter_dashboard.html', 'utf-8');
        loginHtml6 = await readFile('./public/seeker_profile.html', 'utf-8');
        loginHtml7 = await readFile('./public/seeapplicants.html', 'utf-8');
        loginHtml8 = await readFile('./public/html8.html', 'utf-8');
        loginHtml9 = await readFile('./public/job_findings.html', 'utf-8');
        loginHtml10 = await readFile('./public/show_all_hp.html', 'utf-8');
        loginHtml11=await readFile('./public/applyerror.html','utf-8');
        loginHtml12=await readFile('./public/profile_setup.html','utf-8');
    };
    let username_seeker='', username_recruiter='';
    readHtmlFiles();
    router.get('/user_seeker', authenticateSeeker,(req,res)=>{
        console.log( `  seeker dashboard`)
        username_seeker=req.session.seekerUsername
        res.send(`<nav>
            <h1><a href="/" style='color:white;text-decoration: none;'><i class="fa-solid fa-briefcase"></i> CareerConnect</a></h1>
            <div class="links">
                <a href="#" title="Notifications"><i class="fa-solid fa-bell"></i> Notifications</a>
                <a href="/seesetup_profile" title="Profile"><i class="fa-solid fa-user"></i> Profile</a>
                <a href="../message/${req.session.seekerUsername}" title="Messages"><i class="fa-solid fa-envelope"></i> Messages</a>
                <button style="font-size:1.5rem;" id="night-mode-toggle" aria-label="Toggle dark mode">
                    <i class="fa-solid fa-moon"></i>
                </button>
            </div>
        
    </nav><br>
    <h1 style="text-align:center; font-family: Arial, sans-serif; color: #333; margin-top: 15px; margin-bottom: 12px; font-size: 32px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    color:skyblue;">Welcome ${username_seeker}</h1>
     <br>
      ${loginHtml4}<br>`)
    })
    router.get('/user_recruiter',authenticateRecruiter,(req,res)=>{
        console.log( `  recruiter dash_board `)
        username_recruiter=req.session.recruiterUsername;
        res.send(`<header style="background:white;box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1><i class="fas fa-briefcase"></i> <a href="/" style="color:#006699; text-decoration:none;">CareerConnect Recruiter Dashboard</a></h1>
    </header>`+`<h1 >Welcome ${username_recruiter}</h1> ${loginHtml5} <br>`)
    })

let profile=''
router.get('/seeker_profile', authenticateSeeker,(req,response)=>{
    let sql=`SELECT* FROM profile_seeker WHERE username='${req.session.seekerUsername}'`;
    db.query(sql,(err,res)=>{
        if(err){
            console.log(err)
        }else if(res.length>0){
            profile=`<header>
            <a href="../"><i class="fas fa-briefcase"></i> CareerConnect</a>
            </header>
            <div class="profile"> <div class="profile-header">
            <h1>${res[0].username}</h1> <p class="role">${res[0].profile}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${res[0].Location}</p></div>
            <div class="section"><h2><i class="fas fa-user"></i> Bio</h2>
              <div class="about_self">${res[0].description}</div></div>
            <div class="section"><h2><i class="fas fa-code"></i>Skills</h2>
              <div class="skills">${res[0].skills}</div>${loginHtml6} 
            </div>
              </div>`
            response.send(`${profile}`)
        }
        else{
            response.redirect(`/setup_profile`)
        }
    })
})
//Check this !!!!!
router.get('/see_profile/:Name', authenticateRecruiter,(req,response)=>{
    console.log(req.params.Name)
    const name=req.params.Name;
    let sql=`SELECT* FROM profile_seeker WHERE username='${req.params.Name}'`;
    db.query(sql,(err,res)=>{
        if(err){
            console.log(err)
        }else if(res.length>0){
            profile=`<div class="profile"> <div class="profile-header">
            <h1>${res[0].username}</h1> <p class="role">${res[0].profile}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${res[0].Location}</p></div>
            <div class="section"><h2><i class="fas fa-user"></i> Bio</h2>
              <div class="about_self">${res[0].description}</div></div>
            <div class="section"><h2><i class="fas fa-code"></i>Skills</h2>
              <div class="skills">${res[0].skills}</div>
              <h2><i class="fas fa-user-edit"></i>See Resume</h2>
        <form action="../resume/${res[0].username}">
        <input type="submit" value="Resume" class="edit-btn"></form>
        <form action="../cover_letter/${res[0].username}">
            <input type="submit" value="Cover Letter" class="edit-btn"></form>
            <form action="../message_rec/${res[0].username}">
        <input type="submit" value="Message" class="edit-btn"></form>${loginHtml8} 
            </div>
              </div>`
            response.send(`${profile}`)
        }
        else{
            response.send('Candidate has not setup his profile');
        }})
})

router.get('/seesetup_profile',authenticateSeeker,(req,response)=>{
    let sql=`SELECT* FROM profile_seeker WHERE username='${req.session.username_seeker}'`;
    db.query(sql,(err,res)=>{
        if(err){console.log(err)}
        else{
            if(res.length===0){
                response.send(`${loginHtml12}`)
            }
        }
    })
})

router.post('/setup_profile', authenticateSeeker,(req,response)=>{
     console.log('   setup wala route')
     const desc = req.body.desc;
     const location=req.body.location;
     const profile=req.body.role
     let skills = [];
        req.body.skills.forEach(e => {
            skills.push(e);
        });
            let skillString = skills.join(',');
     let sqlite=`SELECT* FROM profile_seeker WHERE username='${req.session.seekerUsername}'`
     db.query(sqlite,(err,res)=>{
        if(err){
            console.log(err)
        }
        else if(res.length===0){    
            let sql = `INSERT INTO profile_seeker VALUES('','${req.session.seekerUsername}',
            '${desc}', '${skillString}','${location}','${profile}')`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    response.redirect('/seeker_profile');
                }
            });
            }
        else{
            let sql=`UPDATE profile_seeker 
            SET description = '${desc}',
                skills = '${skillString}',
                Location = '${location}',
                profile = '${profile}'  
            WHERE username = '${req.session.seekerUsername}'`
            db.query(sql,(err,res)=>{
                if(err){console.log(err)}
                else{
                    response.redirect('/seeker_profile');
                }
            })}
     })   
})

router.post('/post_jobs', [upload3.single('image_employer'), authenticateRecruiter], (req, response) => {
    let flag;
    const { title, job_description: description } = req.body;
    const skills = req.body.skills;
    console.log(skills);
    let requirement = [];
    skills.forEach(e => {
        requirement.push(e);
    });
    
    let skillString = requirement.join(',');
    const job_location = req.body.job_location;
    const company = req.body.comp;
    const employment_type=req.body.emp_type;
    const date = new Date();
    
    let search = `SELECT company FROM job_listings WHERE employer='${req.session.recruiterUsername}';`
    db.query(search, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const company1 = req.body.comp;
            const pos = res.filter(row => row.company.includes(company1));
            console.log(res.length)
            if (pos.length > 0 || res.length===0) {
                flag = 1;
            } else {
                flag = 0;
            }
            if (flag === 0) {
                response.send('No ');
            } else {
                let sql = `INSERT INTO job_listings VALUES('', '${title}', '/images_logo/${req.file.filename}',
                '${description}', '${req.session.recruiterUsername}', '${company}', '${skillString}', '${job_location}','${employment_type}', ' ', '${date}')`;   
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        response.send('<h2>Posted!</h2>');
                    }
                });
            }}
    });
});
module.exports=router;
