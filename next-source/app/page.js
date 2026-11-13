import Portfolio from './portfolio';
import {readContent} from '../lib/content-store';
export const dynamic='force-dynamic';
export default async function Page(){return <Portfolio initialContent={await readContent()}/>}
