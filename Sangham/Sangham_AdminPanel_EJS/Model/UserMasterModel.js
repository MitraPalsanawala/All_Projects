var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserMasterSchema = new mongoose.Schema({
    UserName: { type: String, required: false, default: "" },
    MobileNo: { type: String, required: false, default: "" },
    Address: { type: String, required: false, default: "" },
    ResponsibilityID: { type: ObjectId, required: false, ref: 'Responsibility' },
    SanghShikshanID: { type: ObjectId, required: false, ref: 'SanghShikshan' },
    UserID: { type: ObjectId, required: false, ref: 'UserMaster', default: "" },
    ShakhaMasterID: { type: ObjectId, required: false, ref: 'ShakhaMaster' },
    Star: { type: String, required: false, default: "" },
    Javabadari: { type: String, required: false, default: "" },
    KaryavahType: { type: String, required: false, default: "" },
    SangathanType: { type: String, required: false, default: "" },
    SangathanPramukhType: { type: String, required: false, default: "" },
    JagranType: { type: String, required: false, default: "" },
    JagranPramukhType: { type: String, required: false, default: "" },
    GatividhiType: { type: String, required: false, default: "" },
    GatividhiPramukhType: { type: String, required: false, default: "" },
    VastiPramukhType: { type: String, required: false, default: "" },
    SakhaType: { type: String, required: false, default: "" },
    Photo: { type: String, required: false, default: "" },
    Type: { type: String, required: false, default: "" },//Panel, User
    SubType: { type: String, required: false, default: "" },//
    UserType: { type: String, required: false, default: "" },//SuperUser, NormalUser
    UserRole: { type: String, required: false, default: "" },//SuperUser, NormalUser// MainUser //BhagUser
    UserStatus: { type: String, required: false, default: "" },//Pending,Complete
    OTP: { type: String, required: false, default: "" },
    LoginStatus: { type: String, required: false, default: "" },
    DeviceID: { type: String, required: false, default: "" },
    NotificationStatus: { type: String, required: false, default: "" },
    MainAnnadanStatus: { type: Boolean, required: false, default: 0 },
    MainAddUserStatus: { type: Boolean, required: false, default: 0 },
    MainCollectionStatus: { type: Boolean, required: false, default: 0 },
    MainUserCollectionStatus: { type: Boolean, required: false, default: 0 },
    UniqueCollectionNumber: { type: String, required: false, default: 1234567890 },
    DOB: { type: String, required: false, default: "" },
    BloodGroup: { type: String, required: false, default: "" },
    Education: { type: String, required: false, default: "" },
    ProfessionType: { type: String, required: false, default: "" },
    Profession: { type: String, required: false, default: "" },
    testing: { type: String, required: false, default: "" },
    MainRequestStatus: { type: Boolean, required: false, default: 0 },
    MainBookletUser: { type: Boolean, required: false, default: 0 },
    SuperBookletUser: { type: Boolean, required: false, default: 0 },
    NormalBookletUser: { type: Boolean, required: false, default: 0 },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'UserMaster' }, { timestamps: false });
UserMasterSchema.virtual('BhagDetail', {
    ref: 'UserBhagDetail',
    localField: '_id',
    foreignField: 'UserID',
});
UserMasterSchema.virtual('NagarDetail', {
    ref: 'UserNagarDetail',
    localField: '_id',
    foreignField: 'UserID',
});
UserMasterSchema.virtual('VastiDetail', {
    ref: 'UserVastiDetail',
    localField: '_id',
    foreignField: 'UserID',
});
UserMasterSchema.virtual('AnnadanDetail', {
    ref: 'Annadan',
    localField: '_id',
    foreignField: 'UserID',
});
UserMasterSchema.virtual('CollectionUserDetail', {
    ref: 'Collections',
    localField: '_id',
    foreignField: 'CollectionUserID',
});
UserMasterSchema.virtual('CollectionDetail', {
    ref: 'Collections',
    localField: '_id',
    foreignField: 'UserID',
});
UserMasterSchema.set('toObject', { virtuals: true });
UserMasterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("UserMaster", UserMasterSchema);