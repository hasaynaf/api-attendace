/* core */
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { empty } = require('@prisma/client/runtime')

const prisma = new PrismaClient()
const controller = {}

controller.signin = async (req, res, next) => {
    try {

        if (!req.body.email && !req.body.password) {
            return res.status(400).send({ 
                code:"0", 
                message: "Email dan password wajib di isi!" 
            })
        }

        if (!req.body.email) {
            return res.status(400).send({ 
                code:"0", 
                email: "Email wajib di isi!" 
            })
        }

        if (!req.body.password) {
            return res.status(400).send({ 
                code:"0", 
                password: "Password wajib di isi!" 
            })
        }

        const employee = await prisma.employees.findFirst({
            where : {
                email : req.body.email
            }
        })

        if (!employee) {
            return res.status(404).send({ 
                code:"0", 
                message: "Karyawan tidak terdaftar!" 
            })
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            employee.password
        )
        
        if (!passwordIsValid) {
            return res.status(401).send({
                code:"0",
                message: "Salah kata sandi!",
            })
        }

        const token = jwt.sign({ 
            userId: employee.id, 
            roleId: employee.roleId 
        }, 
            process.env.JWT_SECRET, 
        {
            expiresIn: 86400, // 24 hours
        })

        return res.status(200).send({ 
            code:"1", 
            message: "Berhasil",
            data: {
                roleId: employee.roleId,
                token: token
            } 
        })
    } catch (error) {
        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

module.exports = controller
