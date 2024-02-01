import { useEffect, useState } from "react";

import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
  const country = await res.json();
  return country;
};

const Country = ({ country }) => {
  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    if (country.borders) {
      const borders = await Promise.all(
        country.borders.map((border) => getCountry(border))
      );

      setBorders(borders);
    }
  };

  useEffect(() => {
    getBorders();
  }, []);

  return (
    <Layout title={country.name.common}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <img src={country.flags.svg} alt={country.name.common}></img>

            <h1 className={styles.overview_name}>{country.name.common}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {country.population}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>

              <div className={styles.overview_area}>
                <div className={styles.overview_value}>{country.area}</div>
                <div className={styles.overview_label}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              {country.capital && (
                <div className={styles.details_panel_value}>
                  {country.capital[0]}
                </div>
              )}
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {Object.values(country.languages)
                  .map((key) => key)
                  .join(", ")}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              {country.currencies && (
                <div className={styles.details_panel_value}>
                  {Object.values(country.currencies)
                    .map(({ name, symbol }) => name + " (" + symbol + ")")
                    .join(", ")}
                </div>
              )}
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native name</div>
              <div className={styles.details_panel_value}>
                {Object.values(country.name.nativeName)[0].common}
              </div>
            </div>

            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbouring Countries
              </div>

              <div className={styles.details_panel_borders_container}>
                {borders.map((value) => (
                  <div className={styles.details_panel_borders_country}>
                    <img
                      src={value[0].flags.svg}
                      alt={value[0].name.common}
                    ></img>
                    <div className={styles.details_panel_borders_name}>
                      {value[0].name.common}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();

  const paths = countries.map((country) => ({
    params: { id: country.cca3 },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const countryRes = await getCountry(params.id);
  const country = countryRes[0];

  return {
    props: {
      country,
    },
  };
};
