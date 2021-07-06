'use strict'
const PDFDocument = require('pdfkit')
const fs = require('fs')
const dayjs = require('dayjs')

module.exports = {
  // TODO:
  toPdf: async (ctx) => {
    const {
      address,
      birthPlace,
      city,
      email,
      firstName,
      gender,
      homePhone,
      lastName,
      laterality,
      licenseePhone,
      resp1Phone,
      resp2Phone,
      size,
      zipCode,
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
    const birthDay = new dayjs('02-08-1986')
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
