import {useState} from 'react'
import axios from 'axios';


interface Transaction {
    timeStamp: number;
    from: string;
    to: number;
    value: number;
    confirmations: number;
    hash: string;
    blockNumber: number;
}

function isEthereumAddress(address: string) {
    return address.startsWith('0x') && address.length === 42;
}

/* Etherscan API Key required to bypass call rate limit of 1/5 sec */
const API_KEY = process.env.ETHERSCAN_API_KEY;

function useEtherscan(): [(address: string) => void, Transaction[], string, boolean] {
    const [transactions, setTransactions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function mapResponseBody(rawData: any) {
        /* Store only what is necessary from the server response */
        return rawData.map((element: any) => (
            {
                'hash': element.hash,
                'value': element.value,
                'from': element.from,
                'to': element.to,
                'timeStamp': element.timeStamp,
                'confirmations': element.confirmations,
                'blockNumber': element.blockNumber
            }
        ))
    }

    async function getTransactions(address: string) {
        if (!isEthereumAddress(address)) {
            setErrorMsg('Please enter a valid Ethereum address');
        } else {
            setTransactions([]);
            setIsLoading(true);
            try {
                await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`)
                    .then(res => {
                        if (res.data.status === "1") {
                            const data = mapResponseBody(res.data.result);
                            setErrorMsg('');
                            setTransactions(data);
                        } else if (res.data.message === 'NOTOK') {
                            setErrorMsg(res.data.result);
                        } else {
                            setErrorMsg(res.data.message);
                        }
                        setIsLoading(false);
                    })
            } catch (error) {
                console.warn('Error: ', error);
                setErrorMsg(error);
                setIsLoading(false);
            }
        }
    }

    return [getTransactions, transactions, errorMsg, isLoading];
}

export default useEtherscan;
