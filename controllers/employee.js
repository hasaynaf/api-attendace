/* core */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()
const controller = {}

controller.getAll = async (req, res, next) => {
    try {

        const data = await prisma.employees.findMany()

        await prisma.$disconnect()

        return res.status(200).send({
            code:"1",
            message : 'Berhasil!',
            data : data
        })
    } catch (error) {
        await prisma.$disconnect()

        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

controller.getById = async (req, res, next) => {
    try {

        let id = ''
        if(req.query.method == 'update') id = Number(req.query.id)
        else id = req.userId

        const data = await prisma.employees.findFirst({
            where : {
                id : id
            }
        })

        await prisma.$disconnect()

        return res.status(200).send({
            code:"1",
            message : 'Berhasil!',
            data : data
        })
    } catch (error) {
        await prisma.$disconnect()

        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

controller.create = async (req, res, next) => {
    try {
        if(req.roleId !=1) {
            return res.status(403).send({
                code:"0",
                message: "Maaf, anda bukan admin!",
            })
        }

        if (!req.body.email && !req.body.name && !req.body.password && !req.body.phone && !req.body.roleId) {
            return res.status(400).send({ 
                code:"0", 
                message: "Semua field wajib di isi!" 
            })
        }

        if (!req.body.name) {
            return res.status(400).send({ 
                code:"0", 
                message: "Nama wajib di isi!" 
            })
        }

        if (!req.body.email) {
            return res.status(400).send({ 
                code:"0", 
                message: "Email wajib di isi!" 
            })
        }

        if (!req.body.password) {
            return res.status(400).send({ 
                code:"0", 
                message: "Password wajib di isi!" 
            })
        }

        if (!req.body.roleId) {
            return res.status(400).send({ 
                code:"0", 
                message: "Sebagai wajib di isi!" 
            })
        }

        await prisma.employees.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: bcrypt.hashSync(req.body.password),
                phone: req.body.phone,
                roleId: Number(req.body.roleId),
                active: true,
                created_by: req.userId,
            }
        })

        await prisma.$disconnect()

        return res.status(200).send({
            code:"1",
            message : 'Tambah karyawan berhasil!'
        })
    } catch (error) {
        await prisma.$disconnect()

        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

controller.update = async (req, res, next) => {
    try {
        let id = req.query.id
        if (id == undefined) id = req.body.id
        if (id != undefined) {

            let password = ''
            if (req.body.password !== "") {
                const checkPassword = bcrypt.compareSync(
                    req.body.password,
                    req.body.oldPassword
                )

                if (!checkPassword) password = bcrypt.hashSync(req.body.password)
                else req.body.oldPassword
            } else password = req.body.oldPassword

            await prisma.employees.update({
                where: {
                    id : Number(id)
                },
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: password,
                    phone: req.body.phone,
                    roleId: req.body.roleId ? req.body.roleId : req.roleId,
                    updated_by: req.userId,
                }
            })

            await prisma.$disconnect()

            return res.status(200).send({
                code:"1",
                message : 'Ubah karyawan berhasil!'
            })
        }
        return res.status(404).send({
            code:"0",
            message : 'ID wajib di isi!'
        })
    } catch (error) {
        await prisma.$disconnect()
        
        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

controller.delete = async (req, res, next) => {
    try {
        if(req.roleId !=1) {
            return res.status(403).send({
                code:"0",
                message: "Maaf, anda bukan admin!",
            })
        }
        
        let id = req.query.id
        if (id == undefined) id = req.body.id
        if (id != undefined) {
            await prisma.employees.delete({
                where: {
                    id : Number(id)
                }
            })

            await prisma.$disconnect()

            return res.status(200).send({
                code:"1",
                message : 'Hapus karyawan berhasil!'
            })
        }
        return res.status(404).send({
            code:"0",
            message : 'ID wajib di isi!'
        })
    } catch (error) {
        await prisma.$disconnect()
        
        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

module.exports = controller
