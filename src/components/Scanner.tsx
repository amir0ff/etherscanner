import React, {useState} from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Row,
    Spinner,
    Table,
    InputGroup
} from 'reactstrap';
import Moment from 'react-moment';
import 'moment-timezone';
import useEtherscan from '../utils/hooks/useEtherscan';


function Scanner() {
    const [address, setAddress] = useState('')
    const [getTransactions, transactions, errorMsg, isLoading] = useEtherscan();

    function handleChange(event: React.FormEvent<HTMLInputElement>) {
        setAddress(event.currentTarget.value);
    }

    function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        if (!isLoading) {
            getTransactions(address)
        }
    }

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit} className="mt-3">
                <Row>
                    <Col className="mb-4" lg="6" md="6">
                        <FormGroup className="position-relative">
                            <InputGroup size="sm">
                                <Input invalid={errorMsg !== ''} name="address" type="text" value={address}
                                       onChange={handleChange} placeholder="Search by Address"/>
                                <FormFeedback>{errorMsg}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <Button className="submit-btn" type="submit" size="sm" color="info"
                                disabled={isLoading}>{isLoading ? (
                            <Spinner size="sm" color="light"/>) : 'Submit'}</Button>
                    </Col>
                </Row>
            </Form>
            {transactions && transactions.length > 0 && !isLoading ? (<>
                <h5>Latest Transactions</h5>
                <Table responsive striped hover size="sm">
                    <thead>
                    <tr>
                        <th>Block</th>
                        <th>Time</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Value</th>
                        <th>Confirmations</th>
                        <th>Hash</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(transactions.map(transaction => (
                        <tr key={transaction.hash}>
                            <td><span>{transaction.blockNumber}</span></td>
                            <th scope="col"><Moment unix tz="utc" format="LL LTS">{transaction.timeStamp}</Moment></th>
                            <td><span>{transaction.from}</span></td>
                            <td><span>{transaction.to}</span></td>
                            <td><span>{transaction.value}</span></td>
                            <td><span>{transaction.confirmations}</span></td>
                            <td className="hash-td"><span title={transaction.hash}>{transaction.hash}</span></td>
                        </tr>
                    )))}
                    </tbody>
                </Table></>) : null}
        </Container>
    )
}

export default Scanner;