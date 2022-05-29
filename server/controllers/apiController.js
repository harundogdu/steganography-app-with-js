const fs = require("fs");
const crypto = require("crypto");
const { encode, decode } = require ('@dimensiondev/stego-js');

const encryptText = (text, key) => {
    const cipher = crypto.createCipher("aes-256-cbc", key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

const decryptText = (text, key) => {
    const decipher = crypto.createDecipher("aes-256-cbc", key);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

const uploadImage = (file, path) => {
    return new Promise((resolve, reject) => {
        file.mv(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const stegonographyImage = (path, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const encrypted = encryptText(data.toString(), key);
                fs.writeFile(path, encrypted, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};


module.exports.encrypt = async (req, res) => {
    try {
        const encryptedText = String(req.body.encryptedText);
        const file = req.files.file;

        if (!encryptedText || !file) {
            res.status(400).send('Bad request');
            return;
        }

        // encrypt text
        const key = crypto.randomBytes(128).toString("hex");
        const encryptedTextFromCrypto = encryptText(encryptedText, key);

        // upload image
        const path = `./uploads/images/${file.name}`;
        await uploadImage(file, path);

        // stegonograph image
        await encode(path, encryptedTextFromCrypto);

        /*  // stegonograph image
          await stegonographyImage(path, key);*/

        res.status(200).send({
            key: key,
            path: path
        });

        /*const imagePath = "uploads/images/";
        const textPath = "uploads/texts/";
        const extension = file.name.split(".").pop();
        const fileName = `deneme`;
        const filePath = imagePath + fileName + "." + extension;
        const stringPath = textPath + fileName + ".txt";

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
        })
         // encrypt text
        const key = "harundogdu";
        const encryptedTextFile = encryptText(encryptedText, key);

        // write encrypted text to image
        const image = fs.readFileSync(filePath);
        const imageBuffer = Buffer.from(image);
        const encryptedImage = Buffer.concat([imageBuffer, encryptedTextFile]);
        fs.writeFileSync(filePath, encryptedImage);

        res.status(200).send("Success");

        ;*/

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports.decrypt = async (req, res) => {
    try {
        const file = req.files.file;
        const key = req.body.key;

        if (!file || !key) {
            res.status(400).send('Bad request');
            return;
        }

        // upload image
        const path = `./uploads/images/${Date.now()}_${file.name}`;
        await uploadImage(file, path);

        // read encrypted text from image
        const encryptedText = await decode(path);

        res.status(200).send({
            encryptedText: "sa"
        });

    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
}


/*
function encode(message, image, options) {
    // Handle image url
    if (image.length) {
        image = util.loadImg(image);
    } else if (image.src) {
        image = util.loadImg(image.src);
    } else if (!(image instanceof HTMLImageElement)) {
        throw new Error('IllegalInput: The input image is neither an URL string nor an image.');
    }

    options = options || {};
    var config = this.config;

    var t = options.t || config.t,
        threshold = options.threshold || config.threshold,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize,
        prime = util.findNextPrime(Math.pow(2, t)),
        args = options.args || config.args,
        messageDelimiter = options.messageDelimiter || config.messageDelimiter;

    if (!t || t < 1 || t > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');

    var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');

    shadowCanvas.style.display = 'none';
    shadowCanvas.width = options.width || image.width;
    shadowCanvas.height = options.height || image.height;
    if (options.height && options.width) {
        shadowCtx.drawImage(image, 0, 0, options.width, options.height);
    } else {
        shadowCtx.drawImage(image, 0, 0);
    }

    var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
        data = imageData.data;

    overlapping = codeUnitSize % t,
        modMessage = [],
        decM, oldDec, oldMask, left, right,
        dec, curOverlapping, mask;

    var i, j;
    for (i = 0; i <= message.length; i += 1) {
        dec = message.charCodeAt(i) || 0;
        curOverlapping = (overlapping * i) % t;
        if (curOverlapping > 0 && oldDec) {
            // Mask for the new character, shifted with the count of overlapping bits
            mask = Math.pow(2, t - curOverlapping) - 1;
            // Mask for the old character, i.e. the t-curOverlapping bits on the right
            // of that character
            oldMask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
            left = (dec & mask) << curOverlapping;
            right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
            modMessage.push(left + right);

            if (i < message.length) {
                mask = Math.pow(2, 2 * t - curOverlapping) * (1 - Math.pow(2, -t));
                for (j = 1; j < bundlesPerChar; j += 1) {
                    decM = dec & mask;
                    modMessage.push(decM >> (((j - 1) * t) + (t - curOverlapping)));
                    mask <<= t;
                }
                if ((overlapping * (i + 1)) % t === 0) {
                    mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -t));
                    decM = dec & mask;
                    modMessage.push(decM >> (codeUnitSize - t));
                } else if (((((overlapping * (i + 1)) % t) + (t - curOverlapping)) <= t)) {
                    decM = dec & mask;
                    modMessage.push(decM >> (((bundlesPerChar - 1) * t) + (t - curOverlapping)));
                }
            }
        } else if (i < message.length) {
            mask = Math.pow(2, t) - 1;
            for (j = 0; j < bundlesPerChar; j += 1) {
                decM = dec & mask;
                modMessage.push(decM >> (j * t));
                mask <<= t;
            }
        }
        oldDec = dec;
    }

    // Write Data
    var offset, index, subOffset, delimiter = messageDelimiter(modMessage, threshold),
        q, qS;
    for (offset = 0; (offset + threshold) * 4 <= data.length && (offset + threshold) <= modMessage.length; offset += threshold) {
        qS = [];
        for (i = 0; i < threshold && i + offset < modMessage.length; i += 1) {
            q = 0;
            for (j = offset; j < threshold + offset && j < modMessage.length; j += 1)
                q += modMessage[j] * Math.pow(args(i), j - offset);
            qS[i] = (255 - prime + 1) + (q % prime);
        }
        for (i = offset * 4; i < (offset + qS.length) * 4 && i < data.length; i += 4)
            data[i + 3] = qS[(i / 4) % threshold];

        subOffset = qS.length;
    }
    // Write message-delimiter
    for (index = (offset + subOffset); index - (offset + subOffset) < delimiter.length && (offset + delimiter.length) * 4 < data.length; index += 1)
        data[(index * 4) + 3] = delimiter[index - (offset + subOffset)];
    // Clear remaining data
    for (i = ((index + 1) * 4) + 3; i < data.length; i += 4) data[i] = 255;

    imageData.data = data;
    shadowCtx.putImageData(imageData, 0, 0);

    return shadowCanvas.toDataURL();
};

function decode(image, options) {
    // Handle image url
    if (image.length) {
        image = util.loadImg(image);
    } else if (image.src) {
        image = util.loadImg(image.src);
    } else if (!(image instanceof HTMLImageElement)) {
        throw new Error('IllegalInput: The input image is neither an URL string nor an image.');
    }

    options = options || {};
    var config = this.config;

    var t = options.t || config.t,
        threshold = options.threshold || config.threshold,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize,
        prime = util.findNextPrime(Math.pow(2, t)),
        args = options.args || config.args,
        messageCompleted = options.messageCompleted || config.messageCompleted;

    if (!t || t < 1 || t > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');

    var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');

    shadowCanvas.style.display = 'none';
    shadowCanvas.width = options.width || image.width;
    shadowCanvas.height = options.width || image.height;
    if (options.height && options.width) {
        shadowCtx.drawImage(image, 0, 0, options.width, options.height);
    } else {
        shadowCtx.drawImage(image, 0, 0);
    }

    var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
        data = imageData.data,
        modMessage = [],
        q;

    var i, k, done;
    if (threshold === 1) {
        for (i = 3, done = false; !done && i < data.length && !done; i += 4) {
            done = messageCompleted(data, i, threshold);
            if (!done) modMessage.push(data[i] - (255 - prime + 1));
        }
    } else {
    }

    var message = "", charCode = 0, bitCount = 0, mask = Math.pow(2, codeUnitSize) - 1;
    for (i = 0; i < modMessage.length; i += 1) {
        charCode += modMessage[i] << bitCount;
        bitCount += t;
        if (bitCount >= codeUnitSize) {
            message += String.fromCharCode(charCode & mask);
            bitCount %= codeUnitSize;
            charCode = modMessage[i] >> (t - bitCount);
        }
    }
    if (charCode !== 0) message += String.fromCharCode(charCode & mask);

    return message;
};*/
