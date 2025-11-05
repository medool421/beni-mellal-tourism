import {create} from 'zustand'; // create zustand store
import {MMKV} from  'react-native-mmkv'; // save favorites
import {fetchAttractions} from '../services/api'; // fetch data from API

const storage = new MMKV(); // initialize MMKV storage
//create zustand store  to set and get states
 export const useStore = create ((set, get)=> ({ 
  //initial states
  attraction: [], // all places from API
  favorites :JSON.parse(storage.getString('favorites') || '[]'), // go to MMKV storage and get fav  places or empty array if its null or undefined
  loading: false, // loading state so user instead of seeing loading  spinner he sees the actual content
  error : null, // error state

  // action to fetch attractions from API
  fetchAttractions: async () => {
    set({loading: true, error: null}); // set loading to true and error to null before fetching data
    try {
      const data = await fetchAttractions(); // fetch data from API
      set({attraction: data, loading: false}); // set attraction data and loading to false if we succeed to fetch data
    } catch (error) {
      set({error: 'Failed to fetch attractions', loading: false}); // set error message and loading to false
    }
  },
 
    //toggle favorite action add /remove = favorite / unfavorite
   toggleFavorite: (id) => {
      const {favorites}=get(); //get current favorites from store
      const isFavorite = favorites.includes(id); // check if the id is already in favorites
      const newFavorites = isFavorite
      ? favorites.filter((favId) => favId !== id) // if it is favorite remove it
      : [...favorites, id]; // if not add it
      storage.set('favorites', JSON.stringify(newFavorites)); // update MMKV storage
      set({favorites: newFavorites}); // update zustand store
    },
      //check if place is favorited
  isFavorite: (id) => {
      return get().favorites.includes(id); // return true if id is in favorites else false
},
}));  
     

