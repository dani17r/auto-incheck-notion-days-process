import Koa from 'koa';
const app = new Koa();

import { Client } from '@notionhq/client';
import cron from 'node-cron';

const notion = new Client({ auth:process.env.API_KEY });

const oneAction = async ()=> {
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

const twoAction = async () => {
  const response = await fetch("https://auto-incheck-notion-days-process.onrender.com/").then((resp)=> resp.json());

  console.log("llamado para mantener activo el servidor", response);
}

// const zeroHour = '0 0 * * *';
const oneMinute = '* * * * *';
const threeHour = '0 */3 * * *';

cron.schedule(oneMinute, oneAction);

cron.schedule(threeHour, twoAction);


app.use(ctx => {
  return ctx.body = 'Hello World';
});

app.listen(process.env.PORT || 3000);