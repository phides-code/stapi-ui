import { useQuery } from '@tanstack/react-query';

interface HelloResponse {
    message: string;
}

const App = () => {
    const { data, isLoading, isError } = useQuery<HelloResponse>({
        queryKey: ['hello'],
        queryFn: () => fetch('/api').then((res) => res.json()),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error!</div>;

    console.log('data:');
    console.log(data);

    return <div>{data?.message}</div>;
};

export default App;
