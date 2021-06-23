'use strict';

module.exports = {
    lifecycles: {
        async afterCreate(result, data) {
            // TODO:    
            toPdf: async (ctx) => {
                const data = ctx.response.body
                const result = await createStrapi.entityService.create({ data }, { model: "Fiche_inscriptions" }) // or request
                return console.log("coucou")
            }

            //- Génération de PDF
            // - Stocker le PDF sur un bucket S3
            // - Concaténer l'url du bucket S3 avec le nom du fichier pdf retourné par AWS
            // - Faire un update de l'objet fiche_inscription courant pour lui ajouter le PDF
            // - Faire un envoi de mail en passant la fiche_inscription en paramètre
        },
    }
};
module.exports = {};
