import create from 'zustand';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

const initialState = {
    movieLog: [],
    err: { active: false }
};

const useDataStore = create((set, get) => ({
    ...initialState,
    populate: async (user) => {
        if (!user) return false;
        try {
            console.log("Fetching userData from firestore");
            const res = await getDoc(doc(db, 'webusers', user?.uid));
            const data = res.data();
            set((state) => ({
                ...state,
                movieLog: data?.watchData ?? []
            }));
            return true;
        } catch (error) {
            console.log("Error Occured Firebase getDoc", error);
            set((state) => ({
                ...state,
                err: { active: true, ...error }
            }))
            return false;
        };
    },
    addOne: (item) => {
        if (!item) return false;
        set((state) => ({
            ...state,
            movieLog: [item, ...state.movieLog]
        }));
        return true;
    },
}));

export default useDataStore;