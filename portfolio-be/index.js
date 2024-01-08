import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import { userModel } from './usermodel.js'
mongoose.connect('mongodb+srv://football:football1@cluster0.kk1kc8e.mongodb.net/?retryWrites=true&w=majority')

config()
const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(cors())


app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})


app.get('/success', (req, res) => {
  res.sendFile(path.resolve('./success.html'))
})


// send message
app.post('/success', async (req, res) => {
  const { name, email, project_name, message } = req.body
  if (name === "" || email === "" || project_name === "" || message === "") {
    return res.redirect('/')
  } else {
    await userModel.create({ name, email, project_name, message })
    // gmail information
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "quliyevnamiq8@gmail.com",
        pass: "rwouluweycejzpkh"
      }
    })

    // message details
    let details = {
      from: "quliyevnamiq8@gmail.com",
      to: "quliyevnamiq8@gmail.com",
      subject: `${project_name}`,
      html: ` <h3> Müraciət edənin email adresi : ${email} </h3>
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
  }
})



app.listen(`${process.env.PORT}`, () => console.log(`${process.env.PORT} server is up...`))
