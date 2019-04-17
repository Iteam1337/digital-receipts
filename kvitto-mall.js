{
    "ReceiptCode",
"ReceiptCodeLink",
"Receiver": { // Receipt receiver identification
    "Customer",
    "BusinessUnit",
    "Issuer",
    "ItemText": { // "Text that will be displayed on receipt items"
        "Text": [],
        "TextOnly",
    }
},
"Reminder", // "Swedish extension: Use this field to add a consumer reminder. Example: Due date for warranty, insurance, etc connected to the sales item. "
"HeaderText": [{ // "Text that will be displayed in the receipt header"
    "Text",
}],
"Attachment": [ // "Swedish standard extension: One or more attachments can be added to the receipt. Images/text attached must be base64 encoded"
    {
        "Name",
        "Description",
        "DisplayPeriod",
        "ValidPeriod",
        "ItemLink" // "Link to any line item via sequence number if important"
        "URL", // or "Content"
    }
]
"ControlUnit": { //  Swedish tax control unit extension: A number of lines with control unit info can be added if applicable, will be displayed on the digital receipt
    "Text"
},
"PaymentTerminal": { // "A number of lines with payment terminal info can be added to avoid printing of payment slip"
    "Text"
}
}