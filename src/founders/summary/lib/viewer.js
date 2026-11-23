import { createContext, useContext } from 'react';

/** First name of the signed-in founder, for greetings on the Mariox page ('' when unknown). */
export const ViewerName = createContext('');
export const useViewerName = () => useContext(ViewerName);
