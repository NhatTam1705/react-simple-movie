import { Fragment, lazy, Suspense } from "react";
import { Route, Routes } from 'react-router-dom';
import 'swiper/scss';
import Banner from "./components/banner/Banner";
import Main from "./components/layout/Main";
// import HomePage from './pages/HomePage'
// import MovieDetailsPage from "./pages/MovieDetailsPage";
// import MoviePage from "./pages/MoviePage";

const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const MoviePageV2 = lazy(() => import('./pages/MoviePageV2'));

function App() {
    return (
        <Fragment>
            <Suspense fallback={<></>}>
                <Routes>
                    <Route element={<Main></Main>}>
                        <Route path='/' element={<>
                            <Banner></Banner>
                            <HomePage></HomePage>
                        </>}></Route>
                        <Route path='/movies' element={<MoviePageV2></MoviePageV2>}></Route>
                        <Route path='/movie/:movieId' element={<MovieDetailsPage></MovieDetailsPage>}></Route>
                        <Route path="/*" element={<>Not found</>}></Route>
                    </Route>
                </Routes>
            </Suspense>
        </Fragment>
    );
}

export default App;
