import React, { useState } from 'react';
import { Search, Car, AlertCircle, Gauge, Wrench, Star, Shield, Clock, ExternalLink, Database, Globe, CheckCircle, TrendingDown, FileText, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet';

const PROVIDER = {
  name: 'carVertical',
  urlBase: process.env.REACT_APP_URL_BASE,
  price: 'nga €20.79',
  countries: '40+ vende',
};

const buildPremiumUrl = (vin) => `${PROVIDER.urlBase}${encodeURIComponent(vin)}&voucher=carhistorysite`;

const faqs = [
  {
    q: 'Si mund të kontrollo automjetin me VIN?',
    a: 'Për të kontrolluar automjetin, gjeni numrin VIN/FIN 17-shifror të automjetit (zakonisht gjendet në regjistrim, në derën e shoferit ose në xhamin e përparmë). Vendosni numrin në fushën e kërkimit dhe klikoni "Kontrollo Tani" për rezultate të menjëhershme.',
  },
  {
    q: 'Çfarë informacioni shfaq kontrolli i automjetit?',
    a: 'Kontrolli i automjetit tregon specifikime teknike, historinë e aksidenteve, verifikimin e kilometrazhit, kontrollin e vjedhjes, dhe informacion për riparimet. Raporti premium ofron të dhëna nga 40+ vende dhe 900+ burime.',
  },
  {
    q: 'A është i sigurt kontrolli i automjetit online?',
    a: 'Po, kontrolli i automjetit është plotësisht i sigurt. Përdorim burime zyrtare dhe të verifikuara për të siguruar informacion të saktë dhe të besueshëm mbi historinë e automjetit.',
  },
  {
    q: 'Sa kushton të kontrollosh një automjet?',
    a: 'Kontrolli bazik i automjetit është falas dhe tregon informacion të përgjithshëm. Raporti i plotë premium, që përfshin historinë e detajuar të aksidenteve dhe kilometrazhit, kushton nga €13.99.',
  },
  {
    q: 'Pse duhet të kontrollo makinën përpara blerjes?',
    a: 'Kontrolli i makinës përpara blerjes të ndihmon të zbulosh probleme të fshehura si kilometrazhi i manipuluar, aksidente të mëparshme, ose nëse automjeti është i vjedhur. Kjo mund të të kursejë mijëra euro dhe të shmangë probleme ligjore.',
  },
  {
    q: 'Si funksionon kontrolli i automjetit online?',
    a: 'Vendosni numrin VIN/FIN 17-shifror në fushën e kërkimit. Sistemi i jep kërkesë bazës së të dhënave ndërkombëtare dhe në pak sekonda merr informacion nga 900+ burime në 40+ vende për historinë e automjetit.',
  },
  {
    q: 'A është i besueshëm kontrolli i VIN për makina të përdorura?',
    a: 'Po, kontrolli i VIN është metoda më e besueshme për të verifikuar historinë e një makine të përdorur. Sistemi përdor burime zyrtare si regjistrat e qeverive, kompani sigurimesh dhe qendra shërbimi për të siguruar informacion të saktë.',
  },
  {
    q: 'Çfarë është numri VIN dhe ku e gjej?',
    a: 'VIN (Vehicle Identification Number) ose FIN është një kod unik 17-shifror që identifikon çdo automjet. E gjeni në regjistrim, në derën e shoferit (pjesa e brendshme), në xhamin e përparmë (poshtë majtas), ose në motorr.',
  },
];

const CarHistoryApp = () => {
  const [finNumber, setFinNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [showPremiumOption, setShowPremiumOption] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validateFIN = (fin) => {
    const finRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return finRegex.test(fin.toUpperCase());
  };

  const handleSubmit = async (vinOverride) => {
    const vin = (typeof vinOverride === 'string' && vinOverride) ? vinOverride : finNumber;

    if (!vin.trim()) {
      setError('Ju lutem shkruani numrin e FIN');
      return;
    }

    if (!validateFIN(vin)) {
      setError('Numri i FIN është i pavlefshëm. Duhet të ketë 17 karaktere (A-Z, 0-9, pa I, O, Q)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
      );

      if (!response.ok) {
        throw new Error(`Kërkesa API dështoi: ${response.status}`);
      }

      const data = await response.json();

      if (!data.Results || data.Results.length === 0) {
        throw new Error('FIN i pavlefshëm ose nuk u gjetën të dhëna');
      }

      const findValue = (variableName) => {
        const result = data.Results.find((r) => r.Variable === variableName);
        return result?.Value && result.Value !== 'null' && result.Value !== ''
          ? result.Value
          : 'Nuk ka të dhëna';
      };

      const vehicleData = {
        vehicle: {
          make: findValue('Make'),
          model: findValue('Model'),
          year: findValue('Model Year'),
          vin: vin.toUpperCase(),
          bodyClass: findValue('Body Class'),
          enginePower: findValue('Engine Power (kW)'),
          fuelType: findValue('Fuel Type - Primary'),
          driveType: findValue('Drive Type'),
          vehicleType: findValue('Vehicle Type'),
          plantCountry: findValue('Plant Country'),
          manufacturer: findValue('Manufacturer Name'),
        },
        damage: {
          note: 'Raporti Premium hapet jashtë: të dhënat e aksidenteve nuk shfaqen në këtë aplikacion.',
        },
        mileage: {
          note: 'Raporti Premium hapet jashtë dhe mund të përfshijë historin e kilometrave.',
        },
        theft: {
          note: 'Raporti Premium hapet jashtë dhe mund të përfshijë kontrollet e vjedhjes.',
        },
        specifications: [
          { label: 'Klasa e trupit', value: findValue('Body Class') },
          {
            label: 'Fuqia e motorit',
            value:
              findValue('Engine Power (kW)') +
              (findValue('Engine Power (kW)') !== 'Nuk ka të dhëna' ? ' kW' : ''),
          },
          { label: 'Lloji i karburantit', value: findValue('Fuel Type - Primary') },
          { label: 'Lloji i lëvizjes', value: findValue('Drive Type') },
          { label: 'Lloji i automjetit', value: findValue('Vehicle Type') },
          { label: 'Shteti i prodhimit', value: findValue('Plant Country') },
          { label: 'Dyert', value: findValue('Doors') },
          { label: 'Cilindrat e motorit', value: findValue('Engine Number of Cylinders') },
          { label: 'Lloji i transmisionit', value: findValue('Transmission Style') },
        ].filter((spec) => spec.value !== 'Nuk ka të dhëna'),
      };

      setResults(vehicleData);
      setShowPremiumOption(true);
    } catch (err) {
      console.error('API Error:', err);
      setError(`Dështoi marrja e të dhënave të automjetit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setFinNumber('');
    setResults(null);
    setError('');
    setShowPremiumOption(false);
  };

  const getPageTitle = () => {
    if (results) {
      return `${results.vehicle.make} ${results.vehicle.model} ${results.vehicle.year} - Kontrollo Historin e Automjetit | VIN Check Albania`;
    }
    return 'Kontrollo Automjetin me VIN - Histori Veture | Car History Check';
  };

  const getPageDescription = () => {
    if (results) {
      return `Kontrollo historinë e ${results.vehicle.make} ${results.vehicle.model} ${results.vehicle.year} me VIN ${results.vehicle.vin}. Verifiko kilometrazhin, aksidentet, vjedhjet dhe histori të plotë. Raport i menjëhershëm nga 40+ vende.`;
    }
    return 'Kontrollo automjetin me VIN/FIN para blerjes. Verifiko kilometrazhin, aksidentet, vjedhjet. Histori e plotë e makinës nga 900+ burime në 40+ vende. Raport i menjëhershëm për Shqipëri, Kosovë dhe diasporën Shqiptare.';
  };

  return (
    <>
      <Helmet>
        <html lang="sq" />
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <link rel="canonical" href="https://carhistorysite.com" />

        {/* Open Graph */}
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://carhistorysite.com" />
        <meta property="og:image" content="https://carhistorysite.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content="https://carhistorysite.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Car History Site - Kontrollo Automjetin',
            url: 'https://carhistorysite.com',
            description: 'Kontrollo historin e automjetit me VIN/FIN. Verifiko kilometrazhin, aksidentet dhe specifikime teknike për Shqipëri, Kosovë dhe diasporën.',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            inLanguage: 'sq',
            availableLanguage: ['Albanian', 'English'],
            offers: {
              '@type': 'Offer',
              price: '20.79',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
            provider: {
              '@type': 'Organization',
              name: 'Car History Site',
              url: 'https://carhistorysite.com',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Car History Site',
            description: 'Shërbim online për kontrollimin e historisë së automjeteve në Shqipëri, Kosovë dhe diasporë.',
            url: 'https://carhistorysite.com',
            areaServed: [
              {
                '@type': 'Country',
                name: 'Albania',
              },
              {
                '@type': 'Country',
                name: 'Kosovo',
              },
            ],
            priceRange: '€€',
            serviceType: 'Kontrolli i Automjetit',
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Kontrollo Automjetin',
                item: 'https://carhistorysite.com',
              },
            ],
          })}
        </script>
        {!results && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Si mund të kontrollo automjetin me VIN?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Për të kontrolluar automjetin, gjeni numrin VIN/FIN 17-shifror të automjetit (zakonisht gjendet në regjistrim, në derën e shoferit ose në xhamin e përparmë). Vendosni numrin në fushën e kërkimit dhe klikoni "Kontrollo Tani" për rezultate të menjëhershme.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Çfarë informacioni shfaq kontrolli i automjetit?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Kontrolli i automjetit tregon specifikime teknike, historinë e aksidenteve, verifikimin e kilometrazhit, kontrollin e vjedhjes, dhe informacion për riparimet. Raporti premium ofron të dhëna nga 40+ vende dhe 900+ burime.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'A është i sigurt kontrolli i automjetit online?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Po, kontrolli i automjetit është plotësisht i sigurt. Përdorim burime zyrtare dhe të verifikuara për të siguruar informacion të saktë dhe të besueshëm mbi historinë e automjetit.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Sa kushton të kontrollosh një automjet?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Kontrolli bazik i automjetit është falas dhe tregon informacion të përgjithshëm. Raporti i plotë premium, që përfshin historinë e detajuar të aksidenteve dhe kilometrazhit, kushton nga €13.99.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Pse duhet të kontrollo makinën përpara blerjes?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Kontrolli i makinës përpara blerjes të ndihmon të zbulosh probleme të fshehura si kilometrazhi i manipuluar, aksidente të mëparshme, ose nëse automjeti është i vjedhur. Kjo mund të të kursejë mijëra euro dhe të shmangë probleme ligjore.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Si funksionon kontrolli i automjetit online?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Vendosni numrin VIN/FIN 17-shifror në fushën e kërkimit. Sistemi i jep kërkesë bazës së të dhënave ndërkombëtare dhe në pak sekonda merr informacion nga 900+ burime në 40+ vende për historinë e automjetit.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'A është i besueshëm kontrolli i VIN për makina të përdorura?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Po, kontrolli i VIN është metoda më e besueshme për të verifikuar historinë e një makine të përdorur. Sistemi përdor burime zyrtare si regjistrat e qeverive, kompani sigurimesh dhe qendra shërbimi për të siguruar informacion të saktë.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Çfarë është numri VIN dhe ku e gjej?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'VIN (Vehicle Identification Number) ose FIN është një kod unik 17-shifror që identifikon çdo automjet. E gjeni në regjistrim, në derën e shoferit (pjesa e brendshme), në xhamin e përparmë (poshtë majtas), ose në motorr.',
                  },
                },
              ],
            })}
          </script>
        )}
        {!results && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'Si të kontrollosh historinë e automjetit me VIN',
              description: 'Udhëzues hap pas hapi për të kontrolluar historinë e automjetit tuaj',
              step: [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: 'Gjeni numrin VIN',
                  text: 'Gjeni numrin VIN/FIN 17-shifror të automjetit — në regjistrim, derën e shoferit ose xhamin e përparmë.',
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: 'Vendosni VIN-in',
                  text: "Shkruani numrin VIN në fushën e kërkimit dhe klikoni 'Kontrollo Tani'.",
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: 'Merrni raportin',
                  text: 'Brenda 60 sekondave merrni specifikime teknike falas dhe opsionin për raport të plotë premium.',
                },
              ],
            })}
          </script>
        )}
        {results && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Car',
              name: `${results.vehicle.make} ${results.vehicle.model}`,
              manufacturer: results.vehicle.manufacturer,
              model: results.vehicle.model,
              vehicleIdentificationNumber: results.vehicle.vin,
              productionDate: results.vehicle.year,
              fuelType: results.vehicle.fuelType,
              driveWheelConfiguration: results.vehicle.driveType,
            })}
          </script>
        )}
      </Helmet>
      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 mb-0">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-4">
              <Car className="h-12 w-12 text-amber-400 mr-3" aria-hidden="true" />
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Kontrollo Automjetin me VIN
              </h1>
            </div>
            <p className="text-blue-100 text-lg md:text-xl mb-2 max-w-2xl mx-auto">
              Histori e plotë e makinës — aksidente, kilometrazh, vjedhje — në 60 sekonda
            </p>
            <p className="text-blue-200 text-sm mb-8">
              Shërbim i besuar nga blerës makine në Shqipëri, Kosovë dhe diasporë
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm font-medium">
              <span className="flex items-center gap-1"><Database className="h-4 w-4 text-amber-400" />900+ burime</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4 text-amber-400" />40+ vende</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-amber-400" />Raport në 1 minutë</span>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 flex-grow">

        {/* Search Input Section */}
        <div className="max-w-2xl mx-auto mt-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-700">
            <div className="mb-4">
              <label htmlFor="fin" className="block text-sm font-medium text-gray-700 mb-2">
                Numri FIN (VIN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fin"
                  value={finNumber}
                  onChange={(e) => setFinNumber(e.target.value.toUpperCase())}
                  placeholder="Shkruani numrin FIN me 17 karaktere"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                  maxLength="17"
                  disabled={loading}
                />
                <Search className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-xl font-semibold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Duke kërkuar...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Kontrollo Tani
                  </>
                )}
              </button>

              {!results && (
                <button
                  type="button"
                  onClick={() => {
                    const previewVin = 'JT3HT05J5Y0088443';
                    setFinNumber(previewVin);
                    handleSubmit(previewVin);
                  }}
                  className="px-6 py-3 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
                >
                  Shembull VIN
                </button>
              )}

              {results && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Kërkim i Ri
                </button>
              )}
            </div>

            {showPremiumOption && results && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-yellow-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Hap Raportin Premium jashtë</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Historik i detajuar aksidentesh, kilometrazh i verifikuar dhe kontrolle vjedhjeje nga {PROVIDER.countries}. Raporti hapet në një tab të ri në <span className="font-medium">{PROVIDER.name}</span>.
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="mr-4">{PROVIDER.countries}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Rezultate të menjëhershme</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-gray-800">{PROVIDER.price}</div>
                    <div className="text-sm text-gray-600">Raport një herë</div>
                  </div>
                </div>
                <a
                  href={buildPremiumUrl(results?.vehicle?.vin || finNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 font-medium"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Hap Raportin Premium
                </a>
                <p className="mt-2 text-xs text-gray-600">
                  Shënim: Blerja dhe shikimi i raportit ndodhin tërësisht në faqen e ofruesit. Ky aplikacion nuk ruan të dhëna pagese ose raporti.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Strip */}
        {!results && (
          <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" />SSL i sigurt</span>
            <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-blue-600" />Burime zyrtare</span>
          </div>
        )}

        {/* SEO Content Section - Why Check Car History */}
        {!results && (
          <div className="max-w-4xl mx-auto mb-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pse është i rëndësishëm kontrolli i automjetit para blerjes?</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Blerja e një <strong>makine të përdorur</strong> kërkon kujdes të madh. <strong>Kontrolli i historisë së automjetit</strong> me numrin VIN/FIN është hapi më i rëndësishëm që mund të bëni përpara se të investoni në një automjet. Në Shqipëri, Kosovë dhe në diasporën shqiptare, ka raste të shumta ku <strong>kilometrazhi është manipuluar</strong> ose automjetet kanë <strong>histori aksidentesh të fshehura</strong>.
              </p>
              <p>
                Me shërbimin tonë të <strong>kontrollit të automjetit online</strong>, ju mund të verifikoni menjëherë nëse makina që dëshironi të blini ka probleme të fshehura. <strong>Raporti i automjetit</strong> tregon informacion të detajuar nga 900+ burime ndërkombëtare, duke përfshirë:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Kontroll kilometrazhi</strong> - Zbulo nëse kilometrat janë të manipuluara</li>
                <li><strong>Histori aksidentesh</strong> - Shiko të gjitha aksidentet e raportuara</li>
                <li><strong>Kontroll vjedhje</strong> - Verifiko nëse automjeti është i vjedhur</li>
                <li><strong>Histori shërbimi</strong> - Shiko mirëmbajtjen dhe riparimet e mëparshme</li>
                <li><strong>Specifikime teknike</strong> - Konfirmo detajet e automjetit</li>
              </ul>
              <p>
                Një <strong>kontroll veture para blerjes</strong> ju kursen nga shpenzime të paparashikuara dhe probleme ligjore. Investimi i vogël në një <strong>raport automjeti</strong> mund të ju kursejë mijëra euro në të ardhmen.
              </p>
            </div>
          </div>
        )}

        {/* Key Features Section */}
        {!results && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Çfarë mund të zbulosh?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
                  <Gauge className="h-7 w-7 text-blue-700" aria-label="Ikona verifikimi kilometrazhi" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Verifikim Kilometrazhi</h3>
                <p className="text-gray-600">Zbulo manipulimet e kilometrazhit dhe historinë e vërtetë të përdorimit</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 mb-4">
                  <Wrench className="h-7 w-7 text-orange-600" aria-label="Ikona histori aksidentesh" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Historia e Aksidenteve</h3>
                <p className="text-gray-600">Zbulo dëmtimet e kaluara, riparimet dhe kostot e riparimit</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                  <Shield className="h-7 w-7 text-red-600" aria-label="Ikona kontrolli vjedhje" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Kontrolli i Vjedhjes</h3>
                <p className="text-gray-600">Verifiko nëse automjeti është raportuar si i vjedhur</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
                  <FileText className="h-7 w-7 text-green-600" aria-label="Ikona specifikime teknike" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Specifikime Teknike</h3>
                <p className="text-gray-600">Detaje të plota mbi motorin, karburantin dhe karakteristikat</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-4">
                  <TrendingDown className="h-7 w-7 text-purple-600" aria-label="Ikona vlerësim tregu" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Vlerësimi i Tregut</h3>
                <p className="text-gray-600">Informacion për të shmangur mbipagimin e automjetit</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 mb-4">
                  <CheckCircle className="h-7 w-7 text-teal-600" aria-label="Ikona siguri" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Siguria & Thirrjet</h3>
                <p className="text-gray-600">Shiko vlerësimet e sigurisë dhe thirrjet e prodhuesit</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {!results && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pyetje të Shpeshta</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 font-semibold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {faq.q}
                    <span className={`ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <ChevronDown className="h-5 w-5 text-blue-700" />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Informacioni i Automjetit</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Marka</span>
                  <p className="font-semibold text-lg">{results.vehicle.make}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Modeli</span>
                  <p className="font-semibold text-lg">{results.vehicle.model}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Viti</span>
                  <p className="font-semibold text-lg">{results.vehicle.year}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Prodhuesi</span>
                  <p className="font-semibold text-lg">{results.vehicle.manufacturer}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">Lloji i automjetit</span>
                  <p className="font-semibold text-lg">{results.vehicle.vehicleType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-600">FIN/VIN</span>
                  <p className="font-semibold text-sm font-mono">{results.vehicle.vin}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Wrench className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Historia i Dëmtimeve</h2>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-yellow-800 font-medium">Të dhëna të kufizuara</p>
                  <p className="text-yellow-700 text-sm mt-1">{results.damage.note}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Gauge className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Historia i Kilometrazhit</h2>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-yellow-800 font-medium">Të dhëna të kufizuara</p>
                  <p className="text-yellow-700 text-sm mt-1">{results.mileage.note}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Kontrolli i Vjedhjes</h2>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-yellow-800 font-medium">Të dhëna të kufizuara</p>
                  <p className="text-yellow-700 text-sm mt-1">{results.theft.note}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-blue-900 text-blue-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="font-semibold text-white">Car History Site</p>
          <p>&copy; {new Date().getFullYear()} Car History Site. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex items-center gap-4">
            <span>🇦🇱 Shqipëri</span>
            <span>🇽🇰 Kosovë</span>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default CarHistoryApp;
