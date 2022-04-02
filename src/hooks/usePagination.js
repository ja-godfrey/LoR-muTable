import useState from './useState';

const usePagination = (numPages) => {
   const pages = [...Array(numPages).keys()];
   const [heroPage, setHeroPage] = useState(pages[0]);

   const prevPage = () => {
      const prevVal = heroPage.value > pages[0]
         ? heroPage.value - 1
         : pages[pages.length - 1];
      setHeroPage(prevVal);
   };

   const nextPage = () => {
      const nextVal = heroPage.value < pages[pages.length - 1]
         ? heroPage.value + 1
         : pages[0];
      setHeroPage(nextVal);
   };

   const setPage = val => {
      setHeroPage(val);
   };

   return {
      pages,
      heroPage,
      prevPage,
      nextPage,
      setPage,
   };
};

export default usePagination;
