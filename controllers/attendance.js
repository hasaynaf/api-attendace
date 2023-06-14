/* core */
const { PrismaClient } = require('@prisma/client')
const moment = require('moment')

const prisma = new PrismaClient()
const controller = {}

controller.getAll = async (req, res, next) => {
     try {

        const data = await prisma.attendances.findMany({
            include: {
                employees: true
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

controller.getById = async (req, res, next) => {
     try {

        const data = await prisma.attendances.findMany({
            where: {
                employeeId : req.userId
            },
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

controller.in = async (req, res, next) => {
     try {

        const timeMaxIn = `${moment().format('YYYY-MM-DD')} 10:00:00`
        
        if (moment(req.body.in).isAfter(timeMaxIn)) {
            return res.status(403).send({
                code:"0",
                message: "Maaf, absen masuk tidak boleh lebih dari jam 10:00!",
            })
        }

        const check = await prisma.attendances.findFirst({
            where: {
                employeeId : req.userId
            },
            orderBy: {
                in : 'desc'
            }
        })

        if (!check || (moment(check.in).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD'))) {

            await prisma.attendances.create({
                data: {
                    in: new Date(req.body.in),
                    employeeId: req.userId,
                    created_by: req.userId
                }
            })

            await prisma.$disconnect()

            return res.status(200).send({
                code:"1",
                message : 'Anda berhasil absen masuk!',
            })
        }
        return res.status(500).send({
            code:"0",
            message: "Anda sudah melakukan absen masuk!",
        })
    } catch (error) {
        await prisma.$disconnect()

        return res.status(500).send({
            code:"0",
            message: error.message,
        })
    }
}

controller.out = async (req, res, next) => {
    try {

        const timeMaxOut = `${moment().format('YYYY-MM-DD')} 23:59:59`
        const timeMinOut = `${moment().format('YYYY-MM-DD')} 17:00:00`
        
        if (moment(req.body.out).isAfter(timeMaxOut)) {
            return res.status(403).send({
                code:"0",
                message: "Maaf, absen keluar tidak boleh lebih dari tanngal saat ini dan jam 23:59!",
            })
        }

        if (moment(req.body.out).isBefore(timeMinOut)) {
            return res.status(403).send({
                code:"0",
                message: "Maaf, absen keluar tidak boleh kurang dari tanngal saat ini atau jam 17:00!",
            })
        }

        const check = await prisma.attendances.findFirst({
            where: {
                employeeId : req.userId
            },
            orderBy: {
                in : 'desc'
            }
        })

        if (check && check.out == null) {

            await prisma.attendances.update({
                where: {
                    id : check.id
                },
                data: {
                    out: new Date(req.body.out),
                    updated_by: req.userId
                }
            })

            await prisma.$disconnect()

            return res.status(200).send({
                code:"1",
                message : 'Anda berhasil absen keluar!',
            })
        }
        return res.status(500).send({
            code:"0",
            message: "Anda sudah melakukan absen keluar!",
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
