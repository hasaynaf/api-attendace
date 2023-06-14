/* core */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.roles.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Admin HR',
            active: true,
            created_by: 1,
        },
    })
    const employee = await prisma.roles.upsert({
        where: { id: 2},
        update: {},
        create: {
            name: 'Employee',
            active: true,
            created_by: 1,
        },
    })
    const hr = await prisma.employees.upsert({
        where: { id: 1 },
        update: {},
        create: {
            email: 'hr-admin@argon-group.com',
            name: 'Hr Admin',
            password: '$2a$10$77XOq0eha9SNnQTXCidsGe/YvJUTsFXfcFWy/CzJ1qApqmufWXbSS',
            roleId: 1,
            active: true,
            created_by: 1,
        },
    })
    const hafidz = await prisma.employees.upsert({
        where: { id: 2 },
        update: {},
        create: {
            email: 'hafidz@argon-group.com',
            name: 'Hafidz',
            password: '$2a$10$77XOq0eha9SNnQTXCidsGe/YvJUTsFXfcFWy/CzJ1qApqmufWXbSS',
            roleId: 2,
            active: true,
            created_by: 1,
        },
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })