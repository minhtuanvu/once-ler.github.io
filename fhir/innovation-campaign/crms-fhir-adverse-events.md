####Open.Epic Comic 9/2013
+ This comic strip is no longer available in open.epic.com.  
+ Originally posted in 9/2013, Louise was diagnosed with diabetes.  
+ Her doctor, Dr. D suggests Glucopoke, a gadget that can send readings to his office.  
+ The takeaway from this panel is that Louise is in control of her EHR and actually is the one doing all the work to monitor her condition and sharing her data.

####Open.Epic Comic 9/2013 Cont.
+ The assumption here is that as long as Epic EHR obtains all data that use to be siloed in gadgets or other apps, the healthcare professionals gain visibility and is better equipped to provide better care to Louise.

####Epic MyChart Example Today
+ Where are we today with MyChart and Epic’s vision from 3 years ago?

####Allscripts FollowMyHealth Example
+ As a comparison, Allscripts’ FollowMyHealth provides more control for the patient to link providers, gadgets to their EHR and also a nifty visualization tool that ties the patient’s care provider and facilities found in the patient’s EHR. 

####Open.Epic Timeline
+ Epic has shown that it is committed to using open standards and fully support the implementation of FHIR for it’s products and services.

####SMART on FHIR
+ Good summary of SMART on FHIR can be found here: http://www.beckershospitalreview.com/healthcare-information-technology/smart-on-fhir-5-things-to-know.html
+ The Argonaut Project is a private sector initiative to advance industry adoption of modern, open interoperability standards.
+ JASON, an independent group of elite scientists which advises the United States government on matters of science and technology.
+ JTF, JASON Task Force
+ The JTF... agrees with JASON's recommendation that MU Stage 3 be used as a pivot point to begin the transition to an API-based interoperability paradigm.
+ SMART on FHIR, a "universal app platform", proposed by JASON
+ Source: http://www.informationweek.com/healthcare/policy-and-regulation/a-serious-proposal-for-healthcare-it-interoperability/a/d-id/1316901)

####SMART on FHIR Oauth2 Launch Sequence from EHR Session
+ To summarize, the custom app is first registered with an authorization server.  
+ When the app requests authorization, it is granted a time limited token that allows it access to the FHIR resources provided by the EHR vendor.

####Open.Epic Sandbox with SMART on FHIR Oauth2
+ Open.Epic with SMART on FHIR Oauth2 in action… but not quite there yet.  
+ Epic FHIR Server sandbox crashes on authorized and redirect.

####Open.Epic Sandbox with SMART on FHIR Unprotected
+ Let’s try again with Open.Epic.  
+ But this time, just use SMART on FHIR unprotected.

####Harvard Medical School Sandbox with SMART on FHIR Oauth2
+ The FHIR API allows for the same app to run with any conformant FHIR provider.
+ This means apps can be created regardless who the EHR vendor is.  
+ The EHR vendor only needs to expose the EHR via FHIR.

####Integrating CRMS without ETL or add-ons
+ Different in-house systems are seamlessly integrated in the same app without any ETL or add-ons.

####Open.Epic Sandbox with SMART on FHIR and CRMS
+ User obtains access to patient EHR.  The patient’s MRN can be used to link CRMS participant records if they exist.
+ The assumption is for this app is that the in-house CRMS system is Click Commerce

####How FHIR can help Clinical Research
+ TODOS:
  - Is there a demand for these suggestions?
  - Do researchers and patients alike find value in including FHIR resources in their CRMS records and Adverse Events in their EHR?
  - If so, can we find researchers who would like to participate using an app.
+ QUESTIONS;
  - Have NYUMC implemented Epic’s FHIR offering?
  - To move forward, I would need introductions to the administrators and access to that environment.
