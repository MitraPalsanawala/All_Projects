var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnnadanSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: true, ref: 'Vasti' },
    SocietyID: { type: ObjectId, required: true, ref: 'Society' },
    TrustName: { type: String, required: false, default: "Ambedkar Trust" },
    AnnadanUserName: { type: String, required: false, default: "" },
    MobileNo: { type: String, required: false, default: "" },
    Address: { type: String, required: false, default: "" },
    CharityType: { type: String, required: false },
    ModeOfPayment: { type: String, required: false },
    Amount: { type: String, required: false, default: "" },
    HouseNo: { type: String, required: false, default: "" },
    Landmark: { type: String, required: false, default: "" },
    DrivingLicence: { type: String, required: false, default: "" },
    PanCardNo: { type: String, required: false, default: "" },
    AadharCardNo: { type: String, required: false, default: "" },
    ItemTypeID: { type: ObjectId, required: false, ref: 'ItemType' },
    Qty: { type: String, required: false, default: "" },
    QtyType: { type: String, required: false, default: "" },
    ReceiptNo: { type: String, required: false, default: "" },
    ChequeNo: { type: String, required: false, default: "" },
    Type: { type: String, required: false, default: "" },//Panel, User
    Remark: { type: String, required: false, default: "" },
    AnnadanStatus: { type: String, required: false, default: "" },
    OrderID: { type: String, required: false, default: "" },
    QRCodesignature: { type: String, required: false, default: "" },
    QRCoderesultStatus: { type: String, required: false, default: "" },
    QRCoderesultCode: { type: String, required: false, default: "" },
    QRCoderesultMsg: { type: String, required: false, default: "" },
    QRCodeqrData: { type: String, required: false, default: "" },
    Responsesignature: { type: String, required: false, default: "" },
    ResponseresultStatus: { type: String, required: false, default: "" },
    ResponseresultCode: { type: String, required: false, default: "" },
    ResponseresultMsg: { type: String, required: false, default: "" },
    ResponsetxnId: { type: String, required: false, default: "" },
    ResponsebankTxnId: { type: String, required: false, default: "" },
    ResponsetxnType: { type: String, required: false, default: "" },
    ResponsegatewayName: { type: String, required: false, default: "" },
    ResponsepaymentMode: { type: String, required: false, default: "" },
    ResponsetxnDate: { type: String, required: false, default: "" },
    ResponseposId: { type: String, required: false, default: "" },
    Responseudf1: { type: String, required: false, default: "" },
    PaymentStatus: { type: String, required: false, default: "" },
    CollectionGivenUserID: { type: ObjectId, required: false, ref: 'UserMaster' },
    Email: { type: String, required: false, default: "" },
    BankName: { type: String, required: false, default: "" },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Annadan' }, { timestamps: false });

AnnadanSchema.virtual('AnnadanItemDetail', {
    ref: 'AnnadanItemDetail',
    localField: '_id',
    foreignField: 'AnnadanID',
});
AnnadanSchema.set('toObject', { virtuals: true });
AnnadanSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("Annadan", AnnadanSchema);