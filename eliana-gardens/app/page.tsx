import { Hero }           from '@/components/sections/Hero';
import { TrustBar }       from '@/components/sections/TrustBar';
import { Developer }      from '@/components/sections/Developer';
import { Vision }         from '@/components/sections/Vision';
import { Location }       from '@/components/sections/Location';
import { Pricing }        from '@/components/sections/Pricing';
import { Payment }        from '@/components/sections/Payment';
import { Documentation }  from '@/components/sections/Documentation';
import { Amenities }      from '@/components/sections/Amenities';
import { InspectionForm } from '@/components/sections/InspectionForm';
import { Process }        from '@/components/sections/Process';
import { SocialProof }    from '@/components/sections/SocialProof';
import { FAQ }            from '@/components/sections/FAQ';
import { FinalCTA }       from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Developer />
      <Vision />
      <Location />
      <Pricing />
      <Payment />
      <Documentation />
      <Amenities />
      <InspectionForm />
      <Process />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </>
  );
}
