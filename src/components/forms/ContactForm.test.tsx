import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { isValidElement, Children } from 'react';
import ContactForm from './ContactForm';

const harness = vi.hoisted(() => ({ values: [] as unknown[], setters: [] as ReturnType<typeof vi.fn>[], index: 0, toast: vi.fn() }));
vi.mock('react', async (original) => ({
  ...await original<typeof import('react')>(),
  useState: () => { const i = harness.index++; return [harness.values[i], harness.setters[i]]; },
  useRef: (value: unknown) => ({ current: value }),
}));
vi.mock('lucide-react', () => ({ Mail: 'span', CheckCircle2: 'span', Loader2: 'span', AlertCircle: 'span' }));
vi.mock('react-router-dom', () => ({ Link: 'a' }));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: harness.toast }) }));
vi.mock('@/components/ui/button', () => ({ Button: 'button' }));
vi.mock('@/components/ui/input', () => ({ Input: 'input' }));
vi.mock('@/components/ui/label', () => ({ Label: 'label' }));
vi.mock('@/components/ui/textarea', () => ({ Textarea: 'textarea' }));
vi.mock('@/components/ui/select', () => ({ Select: 'select', SelectContent: 'div', SelectItem: 'option', SelectTrigger: 'button', SelectValue: 'span' }));
vi.mock('@/components/forms/ConsentRow', () => ({ default: 'input' }));
const fields = { name: ' Test Person ', email: ' test@example.com ', phone: '', topic: 'product_question', message: ' Please help with this product. ', consent: false };
const fetchMock = vi.fn();
function form(node: any): any {
  if (!isValidElement(node)) return undefined;
  if (node.type === 'form') return node;
  return Children.toArray((node.props as any).children).map(form).find(Boolean);
}
function setup() {
  harness.index = 0;
  const element = ContactForm({});
  return () => form(element).props.onSubmit({ preventDefault: vi.fn() });
}
beforeEach(() => {
  vi.clearAllMocks();
  harness.values = [{ ...fields }, {}, false, false, false];
  harness.setters = Array.from({ length: 5 }, () => vi.fn());
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('window', { location: { href: 'https://hairpinns.com/contact/', hostname: 'hairpinns.com' }, gtag: vi.fn(), fbq: vi.fn() });
  fetchMock.mockResolvedValue({ ok: true, status: 200 });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('accepted contact enquiry', () => {
  it('counts one lead with no invented value or contact details', async () => {
    await setup()();
    expect(harness.setters[3]).toHaveBeenCalledWith(true);
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith('event', 'generate_lead', { method: 'contact_form' });
    expect(window.fbq).toHaveBeenCalledExactlyOnceWith('track', 'Lead');
    expect(new URLSearchParams(fetchMock.mock.calls[0][1].body).get('email')).toBe('test@example.com');
  });
  it('preserves success when GA throws and still attempts Meta', async () => {
    window.gtag = vi.fn(() => { throw new Error('Unavailable'); });
    await setup()();
    expect(harness.setters[3]).toHaveBeenCalledWith(true);
    expect(harness.setters[4]).not.toHaveBeenCalledWith(true);
    expect(window.fbq).toHaveBeenCalledTimes(1);
  });
  it('preserves success when Meta throws', async () => {
    window.fbq = vi.fn(() => { throw new Error('Unavailable'); });
    await setup()();
    expect(harness.setters[3]).toHaveBeenCalledWith(true);
    expect(harness.setters[4]).not.toHaveBeenCalledWith(true);
  });
  it('queues one lead if GA has not loaded yet', async () => {
    delete window.gtag;
    await setup()();
    expect(window.dataLayer?.map((entry) => Array.from(entry))).toEqual([['event', 'generate_lead', { method: 'contact_form' }]]);
  });
  it('does not submit twice while awaiting acceptance or after success', async () => {
    let accept!: (response: unknown) => void;
    fetchMock.mockImplementation(() => new Promise(resolve => { accept = resolve; }));
    const submit = setup(); const pending = submit();
    await submit(); expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(window.gtag).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
    accept({ ok: true, status: 200 }); await pending;
    await submit(); expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('allows retry after an actual transport failure without counting a lead', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
    const submit = setup(); await submit();
    expect(harness.setters[4]).toHaveBeenCalledWith(true);
    expect(window.gtag).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
    await submit(); expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(harness.setters[3]).toHaveBeenCalledWith(true);
  });
  it('does not send conversion events from preview hosts', async () => {
    window.location.hostname = 'deploy-preview-77--hairpinns.netlify.app';
    await setup()();
    expect(harness.setters[3]).toHaveBeenCalledWith(true);
    expect(window.gtag).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
  });
});
