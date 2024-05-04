import { defineStore } from 'pinia';

export const useCustomizeThemeStore = defineStore({
    id: "customizeTheme",
    state: () => ({
        userconfig:false,
        darkTheme: false,
        primaryColor: {
            colorId: 2,
            colorName: "grey",
            colorValue: "#344767",
        },
        localCode: "en",
        mainSidebar: false,
        adminSidebar:{
            railexpanded:true,
           isMini:true,
        }
        // mainSidebar: isMobile() ? false : true,
    }),

    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ["userconfig", "darkTheme", "primaryColor", "localCode", "mainSidebar","adminSidebar"],
            },
        ],
    },

    getters: {},
    actions: {
        
        setPrimaryColor(payload) {
            this.primaryColor = payload;
        },
        setLocalCode(localCode) {
            this.localCode = localCode;
        },
    },
});

export default useCustomizeThemeStore