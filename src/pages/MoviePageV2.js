import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import MovieCard, { MovieCardSkeleton } from '../components/movie/MovieCard';
import { fetcher, tmdbAPI } from '../config';
import useDebounce from '../hooks/useDebounce';
import { v4 } from 'uuid';
import Button from '../components/button/Button';
import useSWRInfinite from "swr/infinite";

const itemsPerPage = 20;

const MoviePageV2 = () => {
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [nextPage, setNextPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [url, setUrl] = useState(tmdbAPI.getMovieList('popular', nextPage));
    const filterDebounce = useDebounce(filter, 500);
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    const { data, error, size, setSize } = useSWRInfinite(
        (index) => url.replace('page=1', `page=${index + 1}`), fetcher
    );

    const movies = data ? data.reduce((a, b) => a.concat(b.results), []) : [];
    const loading = !data && !error;

    const isEmpty = data?.[0]?.results.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.results.length < itemsPerPage);

    useEffect(() => {
        if (filterDebounce) {
            setUrl(tmdbAPI.getMovieSearch(filterDebounce, nextPage));
        } else {
            setUrl(tmdbAPI.getMovieList('popular', nextPage));
        };
    }, [filterDebounce, nextPage]);

    useEffect(() => {
        if (!data || !data.total_results) return;
        setPageCount(Math.ceil(data.total_results / itemsPerPage));
    }, [data, itemOffset]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.total_results;
        setItemOffset(newOffset);
        setNextPage(event.selected + 1);
    };

    return (
        <div className='py-10 page-container'>
            <div className="flex mb-10 text-white">
                <div className="flex-1">
                    <input type="text" className='w-full p-4 outline-none bg-slate-800' placeholder='Type here your search ...' onChange={handleFilterChange} />
                </div>
                <button className='p-4 bg-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </div>
            {/* {loading && <div className='w-10 h-10 mx-auto border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin'></div>} */}
            <div className="grid grid-cols-4 gap-10">
                {loading && (
                    <>
                        {new Array(20).fill(0).map(() => (
                            <MovieCardSkeleton key={v4()}></MovieCardSkeleton>
                        ))}
                    </>
                )}
                {!loading && movies.length > 0 && movies.map((item) => (
                    <MovieCard key={item.id} item={item}></MovieCard>
                ))}
            </div>
            <div className="mt-10 text-center">
                <Button onClick={() => (isReachingEnd ? {} : setSize(size + 1))} disabled={isReachingEnd} className={`${isReachingEnd ? 'bg-slate-300' : ''}`}>Load More</Button>
            </div>
        </div>
    );
};

export default MoviePageV2;