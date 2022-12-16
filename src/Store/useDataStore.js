import create from 'zustand';
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

const initialState = {
    movieLog: [],
    err: { active: false },
    user: {},
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
                user: user,
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
    addToFirestore: async (data) => {
        if (!data) return false;
        const user = get().user;

        await updateDoc(doc(db, 'webusers', user.uid), {
            watchData: arrayUnion(data)
        }).then((resp) => {
            console.log('addedData', resp);
            return true;
        }).catch(e => {
            console.log('Error Adding Data >> PromiseErr: ', e);
            return false;
        });
    },
    removeAnUpdate: async () => {
        // 
    },
    addOne: (item) => {
        if (!item) return false;
        const movieLog = get().movieLog;
        const exist = await watchData.filter((movie) => {
            return (movie?.name?.toLowerCase() === item?.name.toLowerCase() && movie?.year === item?.year) ||
                (movie?.url === item?.url) || (movie?.id === item?.watchDate);
        })?.length >= 1;
        if (exist) return false;
        set((state) => ({
            ...state,
            movieLog: [item, ...state.movieLog]
        }));

        return true;
    },
}));

export default useDataStore;