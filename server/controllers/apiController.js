const fs = require("fs");

module.exports.upload = async (req, res) => {
    try {
        const encryptedText = String(req.body.encryptedText);
        const file = req.files.file;

        if (!encryptedText || !file) {
            res.status(400).send('Bad request');
            return;
        }

        const imagePath = "uploads/images/";
        const textPath = "uploads/texts/";
        const fileName = file.name;
        const filePath = imagePath + fileName;
        const stringPath = textPath + "text.txt";

        await file.mv(filePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        })

        fs.writeFileSync(stringPath, encryptedText, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });

        res.status(200).send('File uploaded');

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}