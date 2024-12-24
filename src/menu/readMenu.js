import fs from 'fs';

export default function readMenu() {
    try {
        const data = fs.readFileSync("/home/knycper/projekt/protokoly-projekt/src/menu/menu.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
        return null;
    }
}
