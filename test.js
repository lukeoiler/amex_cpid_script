var amexParams = {
  "IntlEapp:DEU:bluev2": {
    campaign: false,
    BAU: {
      sourcesuffix: "A0000FPW9W",
      cpid: {
        Amexcited: "100504581",
        Guide: "100504582",
        Newsletter: "500001072",
      },
    },
    LTO: {
      sourcesuffix: "A0000FPW9W",
      cpid: {
        Amexcited: "100504581",
        Guide: "100504582",
        Newsletter: "500001072",
      },
    },
  },
  "IntlEapp:DEU:green_charge": {
    campaign: false,
    BAU: {
      sourcesuffix: "A0000FPW9V",
      cpid: {
        Amexcited: "100504583",
        Guide: "100504584",
        Newsletter: "500001073",
      },
    },
    LTO: {
      sourcesuffix: "A0000FPW9V",
      cpid: {
        Amexcited: "100504583",
        Guide: "100504584",
        Newsletter: "500001073",
      },
    },
  },
  "IntlEapp:DEU:gold_charge": {
    campaign: true,
    BAU: {
      sourcesuffix: "A0000H9FNY",
      cpid: {
        Amexcited: "100513358",
        Guide: "100513359",
        Newsletter: "100513360",
      },
    },
    LTO: {
      sourcesuffix: "A0000H9FPH",
      cpid: {
        Amexcited: "100513369",
        Guide: "100513370",
        Newsletter: "100513371",
      },
    },
  },
  "IntlEapp:DEU:platinum_charge": {
    campaign: true,
    BAU: {
      sourcesuffix: "A0000H79PT",
      cpid: {
        Amexcited: "500015250",
        Guide: "500015251",
        Newsletter: "500015340",
      },
    },
    LTO: {
      sourcesuffix: "A0000H9FPV",
      cpid: {
        Amexcited: "100513379",
        Guide: "100513380",
        Newsletter: "100513381",
      },
    },
  },
  "IntlEapp:DEU:bmw_card": {
    campaign: false,
    BAU: {
      sourcesuffix: "A0000H7VJV",
      cpid: {
        Amexcited: "100509945",
        Guide: "100509945",
        Newsletter: "100509945",
      },
    },
    LTO: {
      sourcesuffix: "A0000H0RHX",
      cpid: {
        Amexcited: "100504597",
        Guide: "100504598",
        Newsletter: "500001086",
      },
    },
  },
  "IntlEapp:DEU:pbc_LTF_charge": {
    campaign: true,
    BAU: {
      sourcesuffix: "A0000H774H",
      cpid: {
        Amexcited: "100517120",
        Guide: "100517120",
        Newsletter: "100517120",
      },
      PBSourceCode: "70001525",
    },
    LTO: {
      sourcesuffix: "A0000H7XR3",
      cpid: {
        Amexcited: "100517120",
        Guide: "100517120",
        Newsletter: "100517120",
      },
      PBSourceCode: "70001501",
    },
  },
  multicard: {
    sourcesuffix: "A0000FPW9M",
    cpid: {
      Amexcited: "100504593",
      Guide: "100504594",
      Newsletter: "500001084",
    },
  },
};

const modifyLinks = () => {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    let href = link.getAttribute("href");

    if (href) {
      href = href.replace(/&amp;/g, "&");

      const queryString = window.location.search;

      if (
        href.startsWith(
          "https://global.americanexpress.com/acq/intl/dpa/emea/deu/pers/begin.do"
        )
      ) {
        const params = new URLSearchParams(href.split("?")[1]);
        const perform = params.get("perform");
        const referrer = document.referrer;

        const currentUrlParams = new URLSearchParams(queryString);
        const utmSource = currentUrlParams.get("utm_source");
        const utmMedium = currentUrlParams.get("utm_medium");

        let cpidKey = "Amexcited";
        const data = amexParams[perform] || amexParams["multicard"];

        if (utmSource === "newsletter" && utmMedium === "email") {
          cpidKey = "Newsletter";
        }
        if (
          referrer &&
          referrer.startsWith(
            "https://www.americanexpress.com/de-de/kampagnen/guide/"
          )
        ) {
          cpidKey = "Guide";
        }

        const { sourcesuffix, cpid, PBSourceCode } = data.campaign
          ? data.LTO
          : data.BAU;
        params.set("sourcesuffix", sourcesuffix);

        if (cpid[cpidKey] && cpid[cpidKey].trim() !== "") {
          params.set("cpid", cpid[cpidKey]);
        } else {
          params.delete("cpid");
        }

        // Set PBSourceCode if it exists
        if (PBSourceCode) {
          params.set("PBSourceCode", PBSourceCode);
        }

        // If perform is pbc_LTF_charge, change the href
        if (perform === "IntlEapp:DEU:pbc_LTF_charge") {
          href = "https://amex-kreditkarten.de/angebot-payback/";
          params.delete("perform");
        }

        link.setAttribute("href", href.split("?")[0] + "?" + params.toString());
      } else if (
        href.startsWith("https://amex-kreditkarten.de/angebot-payback/")
      ) {
        const params = new URLSearchParams(href.split("?")[1] || "");
        const data = amexParams["IntlEapp:DEU:pbc_LTF_charge"];

        const { sourcesuffix, cpid, PBSourceCode } = data.campaign
          ? data.LTO
          : data.BAU;
        params.set("sourcesuffix", sourcesuffix);
        params.set("cpid", cpid["Amexcited"]);

        // Set PBSourceCode if it exists
        if (PBSourceCode) {
          params.set("PBSourceCode", PBSourceCode);
        }

        link.setAttribute("href", href.split("?")[0] + "?" + params.toString());
      }
    }
  });
};

window.addEventListener("DOMContentLoaded", (event) => {
  modifyLinks();
});
