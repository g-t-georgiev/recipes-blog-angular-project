import path from 'path';
import url from 'url';

export default {
    get __basedir() {
        return path.dirname(url.fileURLToPath(import.meta.url));
    }
}