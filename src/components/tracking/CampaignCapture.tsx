import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureCampaign } from '@/lib/campaignAttribution';

export default function CampaignCapture() {
  const { search } = useLocation();
  useEffect(() => { captureCampaign(search); }, [search]);
  return null;
}
