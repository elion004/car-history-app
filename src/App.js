import React, { useState } from 'react';
import { Search, Car, AlertCircle, Gauge, Wrench, Info, Star, Shield, Clock, ExternalLink } from 'lucide-react';

const PROVIDER = {
  name: 'carVertical',
  urlBase: process.env.REACT_APP_URL_BASE,
  price: 'nga €4.99',
  countries: '40+ vende',
};

const buildPremiumUrl = (vin) => `${PROVIDER.urlBase}${encodeURIComponent(vin)}`;

const CarHistoryApp = () => {
  const [finNumber, setFinNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [showPremiumOption, setShowPremiumOption] = useState(false);

  const validateFIN = (fin) => {
    const finRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return finRegex.test(fin.toUpperCase());
  };

  const handleSubmit = async () => {
    if (!finNumber.trim()) {
      setError('Ju lutem shkruani numrin e FIN');
      return;
    }

    if (!validateFIN(finNumber)) {
      setError('Numri i FIN është i pavlefshëm. Duhet të ketë 17 karaktere (A-Z, 0-9, pa I, O, Q)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${finNumber}?format=json`
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
          vin: finNumber.toUpperCase(),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Car className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Kontrollo Historin e Automjetit</h1>
          </div>
          <p className="text-gray-600 text-lg">Shkruani numrin e FIN për të marrë historin e plotë të automjetit</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Duke kërkuar...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Kërko Historia
                  </>
                )}
              </button>

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
    </div>
  );
};

export default CarHistoryApp;