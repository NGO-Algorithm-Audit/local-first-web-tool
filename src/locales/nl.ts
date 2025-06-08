export const nl = {
    "Let's get started! Fill out the form.":
        'Bienvenue à React et react-i18next',
    shareButton: 'Delen',
    exportButton: 'Exporteren naar .json',
    getStarted: 'Vul het formulier in om te beginnen.',
    fileUploadError: 'Upload een geldig csv-bestand.',
    removeButton: 'Verwijderen',
    dropzoneLabel:
        'Sleep een csv-bestand hierheen, klik om een eigen bestand te selecteren of gebruik de "Demo dataset" knop',
    datasetPreview: 'Voorbeeld van dataset met de eerste 5 rijen.',
    error: 'Sorry, er is iets misgegaan.',
    loadingMessage: 'Omgeving instellen...',
    mostBiasedCluster: 'Meest bevooroordeelde\n cluster',
    cluster: 'Cluster {{value}}',
    downloadButton: 'Download',
    loadingPyodide: 'Python omgeving laden...',
    loadingPackages: 'Laden van packages. Dit duurt gemiddeld 10-15 seconden.',
    installingPackages: 'Aanvullende packages laden',
    biasSettings: {
        exportToPDF: 'Download bias analyse rapport als pdf',
        exportToJSON: 'Export clusters als json',

        form: {
            fieldsets: {
                data: {
                    title: 'Data',
                    dataSet: 'Dataset',
                    dataSetTooltip: `Bereid je data voor zodat: 
                    - missende waarden zijn verwijderd of vervangen;
                    - alle kolommen (behalve de gelijkheidsmetriek-kolom) dezelfde datatypes hebben, numeriek of categorisch;
                    - de gelijkheidsmetriek-kolom numeriek is`,
                    performanceMetric: 'Gelijkheidsmetriek',
                    performanceMetricTooltip:
                        'Clustering vindt plaats aan de hand van de gelijkheidsmetriek. De gelijkheidsmetriek moet een numerieke waarde zijn. Voorbeelden van een gelijkheidsmetriek is "geclassificeerd worden als hoog risico" of "geselecteerd worden voor een controle"',
                    dataType: 'Type data',
                    dataTypeTooltip:
                        'Geef aan of de data categorisch of numeriek zijn. Alle kolommen (behalve de gelijkheidsmetriek-kolom) moeten hetzelfde datatype hebben',
                    categoricalData: 'Categorische data',
                    numericalData: 'Numerieke data',
                    filterSelect:
                        'Selecteer een kolom om cluster distributies te bekijken',
                },
                parameters: {
                    title: 'Parameters',
                    iterations: 'Iteraties',
                    minClusterSize: 'Minimale clustergrootte',
                    performanceInterpretation: {
                        title: 'Interpretatie van gelijkheidsmetriek',
                        lower: 'Lagere waarde van gelijkheidsmetriek is beter, bijv. foutpercentage',
                        higher: 'Hogere waarde van gelijkheidsmetriek is beter, bijv. nauwkeurigheid',
                        tooltip:
                            'Wanneer foutpercentage of misclassificaties worden gekozen als gelijkheidsmetriek geniet een lagere waarde de voorkeur omdat het doel is om fouten te minimaliseren. Andersom: wanneer nauwkeurigheid of precisie wordt geselecteerd als de gelijkheidsmetriek geniet een hogere waarde de voorkeur met oog op het nastreven van maximale prestaties',
                    },
                    iterationsTooltip:
                        'Aantal keren dat de dataset wordt opgesplitst in clusters totdat de minimale clustergrootte is bereikt',
                    minClusterSizeTooltip:
                        'Het minimale aantal datapunten per cluster. Standaard ingesteld op 10% van het aantal rijen in de onderzochte dataset',
                },
            },
            errors: {
                csvRequired: 'Upload een CSV-bestand.',
                targetColumnRequired: 'Selecteer een gelijkheidsmetriek.',
                dataTypeRequired: 'Selecteer een gegevenstype.',
                noNumericColumns:
                    'Geen numerieke kolommen gevonden. Upload een geldige dataset.',
                analysisError: 'Fout tijdens analyse',
                noData: 'Geen gegevens geladen',
                numericDataRequired:
                    'Geselecteerde kolom moet numerieke data bevatten voor k-means clustering.',
                categoricalDataRequired:
                    'Geselecteerde kolom moet categorische data bevatten voor k-modes clustering.',
            },
            actions: {
                tryItOut: 'Demo dataset',
                runAnalysis: 'Start analyse',
                analyzing: 'Analyseren...',
                initializing: 'Initialiseren...',
                selectColumn: 'Selecteer een kolom',
            },
        },
        demoCard: {
            title: 'Probeer het uit!',
            description: 'Geen dataset bij de hand? Gebruik onze demoset.',
        },
    },
    syntheticData: {
        demo: {
            heading: 'Informatie over demodataset',
            description:
                'Een subset van de [Law School Admission Bar](https://www.kaggle.com/datasets/danofer/law-school-admissions-bar-passage)* dataset wordt gebruikt als demo. Synthetische data worden gegenereerd voor de volgende variablen:\n  \n&nbsp;&nbsp;\n\n',
            'post.description':
                'De CART-methode wordt gebruikt om synthetische gegevens te genereren.\n CART produceert doorgaan een goede kwaliteit synthetische data, maar werkt minder goed voor data met categorische data met meer dan 20 categorieën. Gebruik in dit geval Gaussian Copula. \n&nbsp;&nbsp;\n\n*Het oorspronkelijke artikel is [hier](https://files.eric.ed.gov/fulltext/ED469370.pdf) te vinden.',
            'data.column.Variable_name': 'Variabele name',
            'data.sex': 'sex',
            'data.race1': 'race1',
            'data.ugpa': 'ugpa',
            'data.bar': 'bar',

            'data.column.Description': 'Omschrijving',

            'data.column.Description.gender_of_students':
                'geslacht van de student',
            'data.column.Description.race_of_students':
                'etniciteit van de student',
            'data.column.Description.undergraduate_GPA_student':
                'het GPA van de student tijdens de undergraduate-opleiding',
            'data.column.Description.Ground_truth_label':
                'Waarheidslabel dat aangeeft of de student is geslaagd voor de bar',

            'data.column.Values': 'Waardes',

            'data.column.Values.sex': '1 (man), 2 (vrouw)',
            'data.column.Values.race':
                'aziatisch, afrikaans, latino, westers, anders',
            'data.column.Values.ugpa': '1-4',
            'data.column.Values.bar':
                'geslaagd 1e keer, geslaagd 2e keer, gezakt, niet-afgestudeerd',
        },
        exportToPDF: 'Download evulatie rapport als pdf',
        exportToJSON: 'Download synthetische data als json',
        exportToCSV: 'Download synthetische data als csv',
        form: {
            errors: {
                csvRequired: 'Upload een csv-bestand.',
                analysisError: 'Fout tijdens analyse',
                columnsCountError: 'File mag maximaal 8 kolommen bevatten.',
            },
            fieldset: {
                sourceDataset: 'Brondata',
                sdgMethod: {
                    title: 'Methode',
                    cart: 'CART',
                    gc: 'Gaussian Copula',
                    tooltip:
                        'In principe wordt de CART-methode gebruikt om synthetische data te genereren. CART levert over het algemeen synthetische data van hoge kwaliteit, maar werkt mogelijk niet goed bij datasets met categorische variabelen met meer dan 20 categorieën. Gebruik in die gevallen de Gaussian Copula.',
                },
                nanTreatment: {
                    title: 'NaN Waarden Behandeling',
                    drop: 'Verwijder rijen met NaN waarden',
                    impute: 'Vervang NaN waarden',
                    tooltip:
                        'Bij gebruik van Gaussian Copula kunt u kiezen hoe u omgaat met ontbrekende waarden (NaN waarden) in uw dataset. Het verwijderen van rijen met NaN waarden verwijdert deze volledig, terwijl imputatie deze vervangt door gemiddelde waarden voor numerieke kolommen en modus waarden voor categorische kolommen.',
                },
                samples: 'Aantal synthetische datapunten',
            },
            actions: {
                tryItOut: 'Uitproberen',
                runGeneration: 'Start synthetische data generatie',
                analyzing: 'Analyseren...',
                initializing: 'Initialiseren...',
            },
            univariateText:
                '{{samples}} synthetic datapunten via de CART-methode gegeneerd. De grafieken tonen de frequentie waarmee een variabele een bepaalde waarde aanneemt. De synthetische data is van hoge kwaliteit als de frequenties ongeveer gelijke zijn.',
        },
        demoCard: {
            title: 'Probeer het uit!',
            description: 'Geen dataset bij de hand? Gebruik onze demodata.',
        },
        columnsInDatasetInfo:
            'Als de gedetecteerd data types niet correct zijn, pas dit dan lokaal aan in de dataset voordat u deze opnieuw aan de app koppelt.',
        univariateCharts: 'Univariate distributies',
        bivariateDistributionRealData: 'Bivariate distributies',
        univariateDistributionSyntheticData: 'Univariate distributies',
        bivariateDistributionSyntheticData: 'Bivariate distributies',
        correlationRealdata: 'Correlatie matrix',
        correlationSyntheticData: 'Correlatie matrix',
        dataSetPreview: {
            heading: '0. Preview van de data',
        },
        columnsInDataset: '1. Detectie van datatypes',
        handlingMissingDataTitle: '2. Handling missing data',
        handlingMissingDataDescription: 'Handling missing data description',
        handlingMissingDataTableTitle: 'Columns with missing data',
        _explanatoryDataAnalysisTitle: '3. Explanatory data analyse',
        cartModelTitle: '2. Methode: CART model',
        gaussianCopulaModelTitle: '3. Methode: Gaussian Copula model',
        cartModelDescription:
            'De CART-methode (Classification and Regression Trees) genereert synthetische data door patronen uit echte data te leren via een beslisboom die de data opdeelt in homogene groepen op basis van kenmerkwaarden. Voor numerieke data voorspelt de methode gemiddelden, en voor categorische data wijst het de meest voorkomende categorie toe. Deze voorspellingen worden vervolgens gebruikt om nieuwe synthetische gegevenspunten te creëren.',
        evaluationOfGeneratedDataTitle: '4. Evaluatie van gegenereerde data',
        distributionsTitle: '4.1 Distributie',
        diagnosticsReportTitle: '4.2. Diagnostisch rapport',
        diagnosticsTitle: 'Diagnostische Resultaten',
        correlationMatrixTitle: 'Correlatie matrix',
        efficacyMetricsTitle: 'Doeltreffendheid metrieken',
        disclosureProtectionTitle: 'Privacy metrieken',
        outputDataTitle: '5. Output data',
        moreInfoTitle: '6. Meer informatie',
        correlationDifference: 'Correlatie verschil: {{correlationDifference}}',
        moreInfo:
            '&nbsp;&nbsp;\n  \n  \n  \nWil je meer weten over synthetische data?\n  \n  \n  \n- [python-synthpop op Github](https://github.com/NGO-Algorithm-Audit/python-synthpop)\n- [local-first web app op Github](https://github.com/NGO-Algorithm-Audit/local-first-web-tool/tree/main)\n- [Synthetische Data: wat, waarom en hoe?](https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/Synthetic_Data_Survey-24.pdf)\n- [Kennis Netwerk Synthetische Data](https://online.rijksinnovatiecommunity.nl/groups/399-kennisnetwerk-synthetischedata/welcome) (for Dutch public organizations)\n- [Synthetische data portaal van DUO](https://duo.nl/open_onderwijsdata/footer/synthetische-data.jsp)\n- [CART: synthpop resources](https://synthpop.org.uk/resources.html)\n- [Gaussian Copula - Synthetic Data Vault](https://docs.sdv.dev/sdv)',
    },
    biasAnalysis: {
        dataSetPreview: {
            heading: '1. Preview van de data',
        },
        demo: {
            heading: 'Informatie over de demodataset',
            description: `Als demonstratie wordt de [COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) dataset](https://github.com/propublica/compas-analysis/tree/master) geladen. De dataset bevat kenmerken van criminele verdachten en hun risico op recidive, zoals voorspeld door het COMPAS-algoritme. De dataset bevat demografische gegevens zoals leeftijd, geslacht en ras, evenals strafblad, details over de aanklacht en het voorspelde risicolabel. Deze dataset wordt gebruikt als benchmark voor het bestuderen van algoritmische discriminatie. Een beschrijving van alle variabelen is te vinden in de onderstaande tabel.

**Variabelebeschrijving**

| Variabelenaam     | Beschrijving                                              | Waarden                                                                  |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| age_cat          | Leeftijdscategorie                                        | Jonger dan 25, 25-45, Ouder dan 45                                       |
| sex               | Geslacht                                                  | Man, Vrouw                                                               |
| race              | Ras                                                       | Afro-Amerikaans, Aziatisch, Blank, Spaans, Inheems-Amerikaans, Overig    |
| c_charge_degree | Ernst van de strafrechtelijke aanklacht                   | M: Overtreding – Minder ernstige feiten, F: Misdrijf – Ernstigere feiten |
| is_recid         | Of de verdachte opnieuw de fout in ging (recidive)        | 0: Nee, 1: Ja                                                            |
| score_text       | Voorspeld risicolabel van de verdachte                    | 0: Geen hoog risico, 1: Hoog risico                                      |
| false_positive   | Verdachte voorspeld om te recidiveren, maar deed dat niet | 0: geen valse positieve, 1: valse positieve                              |

<br>

In dit voorbeeld analyseren we welke groep het meest nadelig wordt beïnvloed door het risicovoorspellingsalgoritme. Dit doen we door het clusteralgoritme toe te passen op de onderstaande datasetweergave. De kolom "is_recid" geeft aan of een verdachte daadwerkelijk opnieuw de fout in ging (1: ja, 0: nee). De kolom "score_text" geeft aan of werd voorspeld dat een verdachte opnieuw de fout in zou gaan (1: ja, 0: nee). De kolom "false_positive" (FP) vertegenwoordigt gevallen waarin het algoritme voorspelde dat een verdachte opnieuw de fout in zou gaan, maar dit niet gebeurde (1: FP, 0: geen FP). Een voorbeeldweergave van de gegevens is hieronder te vinden. De kolom "false_positive" wordt gebruikt als uitkomstlabel.
`,
        },
        testingStatisticalSignificance: `**5. Testen van clusterverschillen ten opzichte van uitkomstlabels**

- <i class="font-serif">H</i><sub>0</sub>: er is geen verschil in uitkomstlabels tussen het meest afwijkende cluster en de rest van de dataset
- <i class="font-serif">H</i><sub>1</sub>: er is een verschil in uitkomstlabels tussen het meest afwijkende cluster en de rest van de dataset

Er wordt een tweezijdige t-toets uitgevoerd om <i class="font-serif">H</i><sub>0</sub> te aanvaarden of te verwerpen.

p-waarde : {{p_val}}
        `,
        parameters: {
            heading: 'Geselecteerde parameters',
            iterations: 'Aantal iteraties: {{value}}',
            minClusterSize: 'Minimale clustergrootte: {{value}}',
            performanceMetric: 'Prestatiemetingkolom: {{value}}',
            performanceMetricTooltip:
                'De geselecteerde kolom wordt gebruikt om de bias te meten.',
            dataType: 'Gegevenstype: {{value}}',
            description: `- Aantal iteraties: {{iterations}}
- Minimale clustergrootte: {{minClusterSize}}
- Prestatiemetingkolom: {{performanceMetric}}
- Gegevenstype: {{dataType}}
`,
        },
        distribution: {
            mainHeading:
                '6. Testen van clusterverschillen ten opzichte van kenmerken',
            heading: '"{{variable}}" verdeling over de verschillende clusters:',
        },
        splittingDataset: {
            heading: '3. Splitsen dataset',
            description: `Om de kans te verkleinen dat de clusteringmethode ruis detecteert, wordt de dataset opgesplitst in een trainingsset (80%) en een testset (20%). De clusteringmethode wordt eerst getraind op de trainingsset. Vervolgens wordt met behulp van de testset beoordeeld of er sprake is van een statistisch significant signaal in de meest afwijkende clusters.`,
        },
        distributionOfFeaturesAcrossClustersAccordeonTitle:
            'Verdeling van kenmerken over clusters',
        numericalVariableDistributionAcrossClustersAccordeonTitle:
            'Verdeling van numerieke variabelen over clusters',
        clusters: {
            legendMostBiasedCluster: 'Meest bevooroordeelde cluster',
            summary:
                'We hebben {{clusterCount}} clusters gevonden. Cluster met de meeste bias bestaat uit {{biasedCount}} datapunten. De geüploade dataset bestaat uit {{totalCount}} datapunten.',
            sizeHint:
                'Door de parameter "Minimale clustergrootte" aan te passen kan het aantal clusters worden beheerd.',
        },
        biasedCluster: {
            heading: 'In het cluster met de meeste bias hebben datapunten:',
            accordionTitle:
                'Open details om vergelijkingen van kenmerken met de rest van de dataset te bekijken',
            comparison: {
                less: '{{value}} minder {{feature}} dan in de rest van de dataset.',
                more: '{{value}} meer {{feature}} dan in de rest van de dataset.',
                equal: 'gelijke {{feature}} als in de rest van de dataset.',
            },
            difference: {
                appearance: '{{feature}} : {{value}}',
                deviatingMoreOften: `**{{value}}**: Komt **vaker** voor in de meest afwijkende cluster dan in de rest van de dataset.
`,
                deviatingLessOften: `**{{value}}**: Komt **minder** voor in de meest afwijkende cluster dan in de rest van de dataset.
`,
            },
            differenceCategorical: {
                deviatingMoreOften: `**{{feature}}: {{value}}** komt in de meest afwijkende cluster **vaker** voor dan in de rest van de dataset.
`,
                deviatingLessOften: `**{{feature}}: {{value}}** komt in de meest afwijkende cluster **minder** voor dan in de rest van de dataset.
`,
            },
        },
        clusterinResults: {
            heading: '4. Cluster resultaten',
            description: `
- Aantal gevonden clusters: {{clusterCount}}
            `,
            label: 'Kies cluster om het aantal datapunten voor weer te geven',
            valueText: 'Aantal datapunten in cluster {{index}}: {{value}}',
        },
        higherAverage: `De meest bevooroordeelde cluster heeft een statistisch significant hogere gemiddelde bias score dan de rest van de dataset.`,
        noSignificance: `Geen statistisch significant verschil in gemiddelde bias score tussen de meest bevooroordeelde cluster en de rest van de dataset.`,

        conclusion: `7. Conclusie en bias rapport`,
        conclusionDescription: `Uit de bovenstaande figuren en statistische tests kan worden geconcludeerd dat:`,

        moreInformationHeading: `8. Meer informatie`,
        moreInformationDescription: `- [Scientific article](https://arxiv.org/pdf/2502.01713)
- [Github repository](https://github.com/NGO-Algorithm-Audit/unsupervised-bias-detection)`,
    },
    heatmap: {
        realdata: 'Correlatie matrix van gekoppelde data',
        syntheticdata:
            'Absoluut verschil in correlation matrix, m.a.w., |gekoppelde data - synthetische data|',
        synthData: 'Correlatie matrix van synthetische data',
    },
    distribution: {
        distributionFor: 'Distributie voor',
        countFor: 'Distributie voor',
        frequency: 'Frequentie',
        syntheticData: 'Synthetische data',
        realData: 'Echte data',
        percentage: 'Percentage van dataset',
        by: 'van',
        distributionOf: 'Distributie van',
    },
};
