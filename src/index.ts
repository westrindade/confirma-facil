import express from 'express';
import useragent from 'express-useragent';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import manifest from './rev-manifest.json';
import { BaseRoutesConfig } from './routes/base.routes.config';
import { PessoaRoutes } from './routes/pessoa.routes';
import { CargoRoutes } from './routes/cargo.routes';
import { IgrejaRoutes } from './routes/igreja.routes';
import { RelatorioRoutes } from './routes/relatorio.routes';

//dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`), debug: true, override: true });
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`), encoding: 'utf8', debug: true, override: true });
const app = express();

//
const routes : Array<BaseRoutesConfig> = []

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

//rotas js,img e css
//app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname, 'scss')));
app.use('/bundle.js', express.static(path.join(__dirname, `public/js/app/${manifest['bundle.js']}`)));

app.use('/js', express.static(path.join(__dirname, 'node_modules/axios/dist')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/icons')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/inputmask/dist')));
//rotas views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//rotas post
routes.push(new PessoaRoutes(app))
routes.push(new CargoRoutes(app))
routes.push(new IgrejaRoutes(app))
routes.push(new RelatorioRoutes(app))

//arquivo config
const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath, debug: true, override: true });
//const port = 3000;
if (!process.env.PORT || !process.env.NODE_ENV) {
  process.exit(1);
}
const port:number = parseInt(process.env.PORT as string, 10);

/////
app.get('/', (req, res) => {
  res.render('index', { title: 'Confirma Fácil' });
});

app.listen(port, () => {
  routes.forEach((route: BaseRoutesConfig) => {
    route.configureRoutes();
    console.info(`===>[index] Routes configured for ${route.getName()}`);
  });
  console.info(`Servidor rodando em http://localhost:${port}`);
  console.info(`   
  ██╗    ██╗███████╗██████╗          ██████╗ ██████╗ ███╗   ██╗███████╗██╗██████╗ ███╗   ███╗ █████╗     ███████╗ █████╗  ██████╗██╗██╗     
  ██║    ██║██╔════╝██╔══██╗        ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔══██╗████╗ ████║██╔══██╗    ██╔════╝██╔══██╗██╔════╝██║██║     
  ██║ █╗ ██║█████╗  ██████╔╝        ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██████╔╝██╔████╔██║███████║    █████╗  ███████║██║     ██║██║     
  ██║███╗██║██╔══╝  ██╔══██╗        ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██╔══██╗██║╚██╔╝██║██╔══██║    ██╔══╝  ██╔══██║██║     ██║██║     
  ╚███╔███╔╝███████╗██████╔╝        ╚██████╗╚██████╔╝██║ ╚████║██║     ██║██║  ██║██║ ╚═╝ ██║██║  ██║    ██║     ██║  ██║╚██████╗██║███████╗
   ╚══╝╚══╝ ╚══════╝╚═════╝          ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝╚══════╝
`);
});
