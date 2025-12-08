import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CounterProps {
    initial?: number;
}

const Counter: React.FC<CounterProps> = ({ initial = 0 }) => {
    const [count, setCount] = useState(Number(initial));

    return (
        <div className="p-4 border rounded-lg bg-muted flex flex-col items-center gap-4 w-fit my-4">
            <h3 className="text-lg font-semibold">Interactive Counter</h3>
            <div className="text-4xl font-bold">{count}</div>
            <div className="flex gap-2">
                <Button onClick={() => setCount(count - 1)} variant="outline">-</Button>
                <Button onClick={() => setCount(count + 1)} variant="default">+</Button>
            </div>
        </div>
    );
};

export default Counter;
