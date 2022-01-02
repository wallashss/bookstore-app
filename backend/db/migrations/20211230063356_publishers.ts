import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.raw(`
  INSERT INTO publisher VALUES 
    (1,'FTD'\),
    (2,'Brasil'\),
    (3,'Ática'\),
    (4,'Positivo'\),
    (5,'IBEP'\),
    (6,'CPB'\),
    (7,'Moderna'\),
    (8,'Escala'\),
    (9,'Saraiva'\),
    (10,'Camargo'\),
    (11,'Atual'\),
    (12,'EDJovem'\),
    (13,'SM'\),
    (14,'Leya'\),
    (15,'Cereja'\),
    (16,'Oxford'\),
    (17,'Pearson'\),
    (18,'Record'\),
    (19,'Rovelle'\),
    (20,'Ludo'\),
    (21,'Sophos'\),
    (22,'Construir'\),
    (23,'Dimensão'\),
    (24,'Scipione'\),
    (25,'Caramelo'\),
    (26,'Formato'\),
    (27,'Oficina das Finanças'\),
    (28,'Cengage'\),
    (29,'Conhecer'\),
    (30,'Harbra'\),
    (31,'Formando'\),
    (32,'Macmillan'\),
    (33,'Mais Ativos'\),
    (34, 'Melhoramentos'\)
  `)
  

}


export async function down(knex: Knex): Promise<void> {
}

