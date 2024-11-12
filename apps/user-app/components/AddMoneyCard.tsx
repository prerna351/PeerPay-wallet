"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
import axios from "axios";

const SUPPORTED_BANKS = [{
    name: "HDFC",
    // redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "SBI",
    // redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    // const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [bank, setBank] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0)


    const handleAddMoney = async () => {
        try {
            
            const requestData = {
                bank,
                amount: value,
            };
            console.log("hello before")
            // Make the request to your backend on clicking add money
            const response = await axios.post('/api/user', requestData);
            console.log(response.data)
            console.log("hello after")
            // window.location.href = response.data
        
        } catch (error) {
            console.error('Error initiating transaction:', error);
            alert("Error initiating transaction :addmoney comp"); // Show the error message
        }
    };


    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(val) => {
            setValue(Number(val))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            // setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
            setBank(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
        <Button onClick={handleAddMoney}>
            Add Money
            </Button>
        </div>
    </div>
</Card>
}