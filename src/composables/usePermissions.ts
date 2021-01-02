import { useState } from '@/composables/state';
import { getCurrentInstance } from 'vue';

export async function usePermissions(): Promise<boolean> {
    const [isGranted, setIsGranted] = useState(true);
    const app = getCurrentInstance()
    const sqlite = app?.appContext.config.globalProperties.$sqlite;
    const ret = await sqlite.getPlatform()
    if(ret.platform === "android") {
        const res = await sqlite.requestPermissions();
        if(!res.result) {
            setIsGranted(false);
        }
    }
    console.log(`$$$ in usePermissions isGranted ${isGranted.value}`)
    return isGranted.value;
}