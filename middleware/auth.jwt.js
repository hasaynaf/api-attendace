/* core */
const jwt = require("jsonwebtoken")

verifyToken = (req, res, next) => {
    const { authorization } = req.headers
    let token

    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1]
    }

    if (!token) {
        return res.status(403).send({
            code: "0",
            message: "No token provided!",
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                code: "0",
                message: "Unauthorized!",
            })
        }
        req.userId = decoded.userId
        req.roleId = decoded.roleId
        next()
    })
}

const authJwt = {
    verifyToken,
}

module.exports = authJwt