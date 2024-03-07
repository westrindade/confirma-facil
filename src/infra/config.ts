import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`, encoding: 'utf8', debug: true, override: true });
// export const FILE_NAME_BASE = 'C:\\Users\\wtrindade\\Downloads\\web_consultar_excel\\data\\bd_excel.xlsx';
export const FILE_NAME_BASE = `${process.env.FILE_PATH}bd_excel.xlsx`;