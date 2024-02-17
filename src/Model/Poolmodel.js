export default class Pool {
  constructor(title, description, stdate, enddate, type, sponsorImage1, sponsorImage2, emails, Adminid, Competition_name, Competition_cat,Competition_logo) {
    this.title = title;
    this.description = description;
    this.stdate = stdate;
    this.enddate = enddate;
    this.type = type;
    this.sponsorImage1 = sponsorImage1;
    this.sponsorImage2 = sponsorImage2;
    this.emails = emails;
    this.Adminid = Adminid;
    this.Competition_name = Competition_name;
    this.Competition_cat =Competition_cat;
    this.Competition_logo = Competition_logo;
  }

  toPlainObject() {
    return {
      title: { stringValue: this.title },
      description: { stringValue: this.description },
      stdate: { stringValue: this.stdate },
      enddate: { stringValue: this.enddate },
      type: { stringValue: this.type },
      sponsorImage1: { stringValue: this.sponsorImage1 },
      sponsorImage2: { stringValue: this.sponsorImage2 },
      emails: { arrayValue: { values: this.emails.map(email => ({ stringValue: email })) } }, // Convert emails array to an array of strings
      Adminid: { stringValue: this.Adminid },
      Competition_cat: { stringValue: this.Competition_cat },
      Competition_name: { stringValue: this.Competition_name },
      Competition_logo: { stringValue: this.Competition_logo }
    };
  }
}





