const Koa = require('koa');
const app = new Koa();

import { Client } from '@notionhq/client';
import cron from 'node-cron';

const notion = new Client({ auth:process.env.API_KEY });

const action = async ()=> {
  try {
    console.log("log de ejecucion: "+new Date());
    const pages = await notion.databases.query({
        database_id: process.env.DATABASE_ID,
    });
  
    for (const page of pages.results) {
      await notion.pages.update({
        page_id: page.id,
        properties: {
          estado: {
            type: 'checkbox',
            checkbox: false,
          },
        },
      });
    }
  }
  catch(err) {
    console.log("Hubo un error: \n\t"+err);
  }
};

// const options =  {
//    scheduled: true,
//    timezone: "America/Sao_Paulo"
// }

const hourZero = '0 0 * * *';
// const hourZero = '* * * * *';
cron.schedule(hourZero, action /*, options*/);


app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(process.env.PORT || 3000);