import express from 'express'
import { connect } from 'mongoose'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { userModel } from './usermodel.js'
connect("mongodb+srv://node01:node01@cluster0.aeevlra.mongodb.net/?retryWrites=true&w=majority")
const app = express()

// MiddleWare
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(cors())

// web page
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})

app.get('/success', (req, res) => {
  res.sendFile(path.resolve('./success.html'))
})

// send message
app.post('/success', async (req, res) => {
  const { name, email, project_name, message } = req.body
  await userModel.create({name, email, project_name, message})
  // gmail information
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "quliyevnamiq8@gmail.com",
      pass: "vwwgaysbferftezu"
    }
  })

  // message details
  let details = {
    from: "quliyevnamiq8@gmail.com",
    to: "quliyevnamiq8@gmail.com",
    subject: `${project_name}`,
    html: ` <h3> Müraciət edən email adresi : ${email} </h3>
            <h3> Müraciət edən şəxs : ${name} </h3><br>
            <h4> Məlumat mesajı : ${message}</h4> `
  }

  // message sending
  mailTransporter.sendMail(details, (err) => {
    if (err) {
      return res.status(400).send({ success: false, error: err.message });
    }
    return res.redirect('/success')
  })
})

app.listen(7002, () => console.log('server is up...'))
