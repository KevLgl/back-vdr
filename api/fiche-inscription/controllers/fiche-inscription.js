'use strict'
const PDFDocument = require('pdfkit')
const fs = require('fs')
const dayjs = require('dayjs')

module.exports = {
  // TODO:
  toPdf: async (ctx) => {
    const {
      firstName,
      lastName,
      birthdate,
      place_of_birth: birthPlace,
      gender,
      height: size,
      lateralite: laterality,
      address,
      cp: zipCode,
      country: city,
      phone_number1: licenseePhone,
      phone_number2: homePhone,
      phone_number3: resp1Phone,
      phone_number4: resp2Phone,
      email,
      reglement,
      charte,
      photo: pictureAuthorization,
    } = ctx.request.body
    const doc = new PDFDocument({ size: 'A4' })
    const now = new dayjs()

    // Open the document creation
    doc.pipe(fs.createWriteStream(`public/inscriptions/${now.valueOf()}.pdf`))

    // Line
    doc.lineCap('butt')
       .moveTo(0, 130)
       .lineTo(595.28, 130)
       .stroke()
    // Logo
    doc.image('public/assets/img/logo.png', 6, 50, { fit: [120, 120] })

    // Title
    doc.font('public/assets/fonts/Roboto-Bold.ttf')
       .fillColor('#c82505')
       .fontSize(16)
       .text('FICHE D\'INSCRIPTION CLUB', 60, 40, {
         align: 'right',
         width: 472.28,
       })
       .moveDown()
       .text('SAISON 2020-2021', {
         align: 'right',
       })

    // Data
    const birthDay = new dayjs(birthdate)
    const isMale = gender === 'M'
    doc.font('public/assets/fonts/RobotoSlab-Regular.ttf')
       .fillColor('black')
       .fontSize(12)
       .text(`Nom : ${lastName}`, 60, 223, {
         width: 472.28,
       })
       .text(`Prénom : ${firstName}`, 295, 223, {
         width: 472.28,
       })
       .moveDown()
       .text(`Date de naissance : ${birthDay.format('DD/MM/YYYY')}      Lieu de Naissance : ${birthPlace}`, 60)
       .moveDown()
       .text(`Sexe : ${gender}      Taille ${isMale ? 'du licencié'
                                                    : 'de la licenciée'} : ${size}cm      Latéralité : ${laterality}`)
       .moveDown()
       .text(`Adresse : ${address}`)
       .moveDown()
       .text(`Code postal : ${zipCode}    Ville : ${city}`)

    if (licenseePhone || homePhone) {
      let firstPhoneLine = ''
      if (licenseePhone) {
        firstPhoneLine += `Tél. licencié${isMale ? '' : 'e'} : ${licenseePhone}`
      }

      if (homePhone) {
        if (licenseePhone) {
          firstPhoneLine += '    '
        }

        firstPhoneLine += `Tél. domicile : ${homePhone}`
      }
      doc.moveDown()
         .text(firstPhoneLine)
    }

    if (resp1Phone || resp2Phone) {
      let secondPhoneLine = ''

      if (resp1Phone) {
        secondPhoneLine += `Tél. responsable 1 : ${resp1Phone}`
      }

      if (resp2Phone) {
        if (resp1Phone) {
          secondPhoneLine += `    `
        }

        secondPhoneLine += `Tél. responsable 2 : ${resp2Phone}`
      }

      doc.moveDown()
         .text(secondPhoneLine)
    }

    doc.moveDown()
       .text(`Courriel : ${email}`)

    const checkbox = (height, text, checked = true) => {
      doc.lineWidth(1)
      doc.lineJoin('miter')
         .rect(60, height, 10, 10)
         .stroke()

      if (checked) {
        doc.fillColor('black')
           .path(`M62,${height + 2} l0.5,-0.5 l2.5,2.5 l2.5,-2.5 l1,1 l-2.5,2.5 l2.5,2.5 l-1,1 l-2.5,-2.5 l-2.5,2.5 l-1,-1 l2.5,-2.5 l-2.5,-2.5z`)
           .fill('non-zero')
      }

      doc.font('public/assets/fonts/RobotoSlab-Regular.ttf')
         .fillColor('black')
         .fontSize(12)
         .text(text, 80, height - 3, {
           width: 452.28,
         })
    }
    checkbox(
      480,
      `Je déclare avoir pris connaissance du règlement intérieur du club et en accepter les conditions.`,
      reglement,
    )
    checkbox(
      520,
      `Je déclare avoir pris connaissance de la Charte du club et en accepter les conditions.`,
      charte,
    )
    checkbox(
      560,
      `J’accepte que l’EVDRLHB publie des photos prises dans le cadre des rencontres sportives dans le cadre d’activités liées à la vie du club sur lesquelles j’apparais.`,
      pictureAuthorization || false,
    )

    doc.end()
    /*const data = ctx.response.body
    const result = await createStrapi.entityService.create({ data }, { model: "Fiche_inscriptions" }) // or request
    return result*/
  }
  ,
  //- Génération de PDF
  // - Stocker le PDF sur un bucket S3
  // - Concaténer l'url du bucket S3 avec le nom du fichier pdf retourné par AWS
  // - Faire un update de l'objet fiche_inscription courant pour lui ajouter le PDF
  // - Faire un envoi de mail en passant la fiche_inscription en paramètre
}
