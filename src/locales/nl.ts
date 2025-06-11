export const nl = {
    "Let's get started! Fill out the form.":
        'Bienvenue à React et react-i18next',
    shareButton: 'Delen',
    exportButton: 'Exporteren naar .json',
    getStarted: 'Vul het formulier in om te beginnen.',
    fileUploadError: 'Upload een geldig csv-bestand.',
    removeButton: 'Verwijderen',
    dropzoneLabel:
        'Sleep een csv-bestand hierheen, klik om een lokaal bestand te selecteren of gebruik de "Demo dataset" knop',
    datasetPreview: 'Voorbeeld van dataset met de eerste 5 rijen.',
    error: 'Sorry, er is iets misgegaan.',
    loadingMessage: 'Omgeving instellen...',
    mostBiasedCluster: 'Meest bevooroordeelde\n cluster',
    cluster: 'Cluster {{value}}',
    downloadButton: 'Download',
    loadingPyodide: 'Python omgeving laden...',
    loadingPackages: 'Laden van packages. Dit duurt gemiddeld 10-15 seconden.',
    installingPackages: 'Aanvullende packages laden',
    runningAnalysis: 'Analyse uitvoeren...',
    biasSettings: {
        dataType: {
            numeric: 'Numeriek',
            categorical: 'Categorisch',
        },
        exportToPDF: 'Download bias analyse rapport als pdf',
        exportToJSON: 'Export clusters als json',

        form: {
            fieldsets: {
                data: {
                    title: 'Data',
                    dataSet: 'Dataset',
                    dataSetTooltip: `Bereid je data voor zodat: 
                    - missende waarden zijn verwijderd of vervangen;
                    - alle kolommen (behalve de bias variabele-kolom) dezelfde datatypes hebben, numeriek of categorisch;
                    - de bias variabele-kolom numeriek is`,
                    performanceMetric: 'Bias variabele',
                    performanceMetricTooltip:
                        'Clustering vindt plaats aan de hand van de bias variabele, welk een numerieke waarde moet zijn. Voorbeelden van een bias variabele zijn "geclassificeerd als hoog risico" of "geselecteerd voor controle"',
                    dataType: 'Type data',
                    dataTypeTooltip:
                        'Geef aan of de data categorisch of numeriek zijn. Alle kolommen (behalve de bias variabele-kolom) moeten hetzelfde datatype hebben',
                    categoricalData: 'Categorische data',
                    numericalData: 'Numerieke data',
                    filterSelect:
                        'Selecteer een kolom om de verdeling per cluster te bekijken',
                },
                parameters: {
                    title: 'Hyperparameters',
                    iterations: 'Iteraties',
                    minClusterSize: 'Minimale clustergrootte',
                    performanceInterpretation: {
                        title: 'Interpretatie van bias variabele',
                        lower: 'Lagere waarde van bias variabele is beter, bijv. foutpercentage',
                        higher: 'Hogere waarde van bias variabele is beter, bijv. nauwkeurigheid',
                        tooltip:
                            'Wanneer foutpercentage of misclassificaties worden gekozen als bias variabele wordt een lagere waarde als beter beschouwd omdat het doel is om fouten te minimaliseren. Andersom: wanneer nauwkeurigheid of precisie wordt geselecteerd als de bias variabele wordt een hogere waarde als beter beschouwd met oog op het nastreven van maximale prestaties. Geselecteerd worden voor controle of een valspositieve wordt als nadeling beschouwd, voor deze gevallen is een lagere waarde dus beter',
                    },
                    iterationsTooltip:
                        'Aantal keren dat de dataset wordt opgesplitst in kleinere clusters. Kan voortijdig worden gestopt als de minimale clustergrootte bereikt is',
                    minClusterSizeTooltip:
                        'Het minimale aantal datapunten per cluster. Standaard ingesteld op 1% van het aantal rijen in de onderzochte dataset',
                },
            },
            errors: {
                csvRequired: 'Upload een CSV-bestand.',
                targetColumnRequired: 'Selecteer een bias variabele.',
                dataTypeRequired: 'Selecteer een gegevenstype.',
                noNumericColumns:
                    'Geen numerieke kolommen gevonden. Upload een geldige dataset.',
                analysisError: 'Fout tijdens analyse',
                noData: 'Geen gegevens geladen',
                numericDataRequired:
                    'Niet alle data hebben hetzelfde formaat, pas dit lokaal aan voordat je de data toevoegt.',
                categoricalDataRequired:
                    'Niet alle data hebben hetzelfde formaat, pas dit lokaal aan voordat je de data toevoegt.',
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
                'Een subset van de [Law School Admission Bar](https://www.kaggle.com/datasets/danofer/law-school-admissions-bar-passage)* dataset wordt gebruikt als demo. Synthetische data worden gegenereerd voor de volgende variablen:',
            'post.description':
                '<br>De CART-methode wordt gebruikt om synthetische gegevens te genereren.\n CART produceert doorgaan een goede kwaliteit synthetische data, maar werkt minder goed voor categorische data met meer dan 20 categorieën. Gebruik in dit geval Gaussian Copula. \n&nbsp;&nbsp;\n\n*Het oorspronkelijke artikel is [hier](https://files.eric.ed.gov/fulltext/ED469370.pdf) te vinden.',
            'data.column.Variable_name': 'Naam variabele',
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
                'Aziatisch, Afro-amerikaans, Latijs-amerikaans, Westers, anders',
            'data.column.Values.ugpa': '1-4',
            'data.column.Values.bar':
                'Geslaagd 1e keer, Geslaagd 2e keer, Gezakt, Niet-afgestudeerd',
        },
        exportToPDF: 'Download evaluatierapport als pdf',
        exportToJSON: 'Download synthetische data als json',
        exportToCSV: 'Download synthetische data als csv',
        form: {
            errors: {
                csvRequired: 'Upload een csv-bestand.',
                analysisError: 'Fout tijdens analyse',
                columnsCountError: 'File mag maximaal 8 kolommen bevatten.',
            },
            fieldset: {
                sourceDataset: 'Input',
                dataSet: 'Dataset',
                dataSetTooltip: `Alleen categorische, numerieke of tijdsdata kunnen worden verwerkt. Datasets mogen maximaal 8 kolommen bevatten, dienen een header te hebben met kolomnamen en hoeven geen index-kolom te hebben`,
                sdgMethod: {
                    title: 'Methode',
                    cart: 'CART',
                    gc: 'Gaussian Copula',
                    tooltip:
                        'Standaard wordt de CART-methode gebruikt om synthetische data te genereren. CART levert over het algemeen synthetische data van hoge kwaliteit, maar werkt mogelijk niet goed bij datasets met categorische variabelen met meer dan 20 categorieën. Gebruik in die gevallen de Gaussian Copula',
                },
                nanTreatment: {
                    title: 'NaN Waarden Behandeling',
                    drop: 'Verwijder rijen met NaN waarden',
                    impute: 'Vervang NaN waarden',
                    tooltip:
                        'Bij gebruik van Gaussian Copula kunt u kiezen hoe u omgaat met ontbrekende waarden (NaN waarden) in uw dataset. Het verwijderen van rijen met NaN waarden verwijdert deze volledig, terwijl imputatie deze vervangt door gemiddelde waarden voor numerieke kolommen en modus waarden voor categorische kolommen',
                },
                samples: 'Aantal synthetische datapunten',
                outputSamplesTooltip:
                    'Aantal synthetische datapunten die door de tool worden gegenereerd. Vanwege de rekencapaciteit van browser-gebaseerde datageneratie is het maximum ingesteld op 5.000.',
            },
            actions: {
                tryItOut: 'Demo dataset',
                runGeneration: 'Start synthetische data generatie',
                analyzing: 'Analyseren...',
                initializing: 'Initialiseren...',
            },
            univariateText:
                '<br> {{samples}} synthetic datapunten via de CART-methode gegeneerd. De grafieken tonen de frequentie waarmee een variabele een bepaalde waarde aanneemt. De synthetische data is van hoge kwaliteit als de frequenties ongeveer gelijke zijn.',
        },
        demoCard: {
            title: 'Probeer het uit!',
            description: 'Geen dataset bij de hand? Gebruik onze demo dataset',
        },
        columnsInDatasetInfo:
            'Als de gedetecteerd data types niet correct zijn, pas dit dan lokaal aan in de dataset voordat u deze opnieuw aan de app koppelt.',
        univariateCharts: 'Univariate distributies',
        bivariateDistributionRealData: 'Bivariate distributies',
        univariateDistributionSyntheticData: 'Univariate distributies',
        bivariateDistributionSyntheticData: 'Bivariate distributies',
        correlationRealdata: 'Correlatiematrix',
        correlationSyntheticData: 'Correlatiematrix',
        dataSetPreview: {
            heading: '0. Voorbeeld van de data',
        },
        columnsInDataset: '1. Detectie van datatypes',
        handlingMissingDataTitle: '2. Omgang missende data',
        handlingMissingDataDescription: 'Beschrijving omgang missende data',
        handlingMissingDataTableTitle: 'Kolommen met missende data',
        _explanatoryDataAnalysisTitle: '3. Explanatory data analyse',
        cartModelTitle: '3. Methode: CART model',
        gaussianCopulaModelTitle: '3. Methode: Gaussian Copula model',
        cartModelDescription:
            'De CART-methode (Classification and Regression Trees) genereert synthetische data door patronen uit echte data te leren via een beslisboom die de data opdeelt in homogene groepen op basis van kenmerken. Voor numerieke data voorspelt de methode gemiddelden en voor categorische data wijst het de meest voorkomende categorie toe. Deze voorspellingen worden vervolgens gebruikt om synthetische datapunten te creëren.\n \n {{samples}} synthetische datapunten zijn gegenereerd.',
        evaluationOfGeneratedDataTitle:
            '4. Evaluatie van gegenereerde synthetische data',
        distributionsTitle: '4.1 Distributies',
        diagnosticsReportTitle: '4.2. Diagnostisch rapport',
        diagnosticsTitle: 'Diagnostische resultaten',
        diagnosticsReportDescription: `Voor iedere kolom worden diagnostische resultaten berekend voor de kwaliteit van de gegenereerde synthetische data. De berekende statistieken zijn afhankelijk van het type data.

Voor numerieke- of tijddata worden de volgende metrieken berekend:
- {tooltip:syntheticData.missingValueSimilarity}Overeenkomst ontbrekende waarden{/tooltip}
- {tooltip:syntheticData.rangeCoverage}Bereik dekkend{/tooltip}
- {tooltip:syntheticData.boundaryAdherenc}Grens eerbiediging{/tooltip}
- {tooltip:syntheticData.statisticSimilarity}Statistische overeenkomst{/tooltip}
- {tooltip:syntheticData.kolmogorovSmirnovComplement}Kolmogorov–Smirnov (KS) complement{/tooltip}

Voor categorische data worden de volgende metrieken berekend:
- {tooltip:syntheticData.missingValueSimilarity}Overeenkomst ontbrekende waarden{/tooltip}
- {tooltip:syntheticData.categoryCoverage}Categorie dekking{/tooltip}
- {tooltip:syntheticData.categoryAdherence}Categorie eerbiediging{/tooltip}
- {tooltip:syntheticData.totalVariationComplement}Totale variatie (TV) complement{/tooltip}

💯 Bij goede kwaliteit synthetische data liggen alle waarden in de buurt van de 1.0, maar zeker hoger dan 0.85.`,
        missingValueSimilarity:
            'Vergelijkt of het aandeel missende waarden in de synthetische data gelijk is aan dat in de echte data',
        rangeCoverage:
            'Bepaalt per kolom of synthetische data het volledige bereik van waarden uit de echte data dekt',
        boundaryAdherenc:
            'Bepaalt per kolom of synthetische data binnen de minimum- en maximumwaarden van de echte data blijven. Geeft het percentage rijen synthetische data dat binnen de grenzen valt',
        statisticSimilarity:
            'Vergelijkt per kolom gemiddelde, standaarddeviatie en mediaan tussen echte en synthetische data',
        kolmogorovSmirnovComplement:
            'Meet het maximale verschil tussen de cumulatieve distributiefuncties (CDF’s) van numerieke kolommen in de synthetische en echte dataset',
        categoryCoverage:
            'Bepaalt per kolom of de synthetische data alle categorieën uit de echte data bevat',
        categoryAdherence:
            'Bepaalt per kolom of synthetische data dezelfde categorieën bevat als de echte data',
        totalVariationComplement:
            'Meet het maximale verschil tussen de cumulatieve distributiefuncties (CDF’s) van categorische kolommen in de synthetische en echte dataset',
        correlationMatrixTitle: 'Correlatiematrix',
        correlationMatrixDescription: `De onderstaande matrices tonen één-op-één correlaties tussen variabelen in de echte en synthetische data. Groene cellen vertegenwoordigen zwakke lineaire relaties, terwijl rode cellen sterke lineaire relaties aangeven. De kleurpatronen in beide matrices zouden grote overeenkomsten moeten hebben.`,
        efficacyMetricsTitle: 'Effectiviteitsmetrieken',
        efficacyMetricsDescription: `Effectiviteitsmetrieken vergelijken de echte en synthetische datasets voor voorspellende taken. Het idee is om een voorspellend model te trainen op synthetische data en de prestaties van het model te evalueren op de echte data. Het type effectiviteitsmetriek hangt af van de taak:

Voor regressie (doelvariabele is numeriek):
- {tooltip:syntheticData.meanSquaredError}Mean squared error (MSE){/tooltip}
- {tooltip:syntheticData.meanAbsoluteError}Mean Absolute Error (MAE){/tooltip}
- {tooltip:syntheticData.R2}R² Score{/tooltip}

Voor classificatie (doelvariabele is categorisch):
- {tooltip:syntheticData.accuracyScore}Accuracy Score{/tooltip}
- {tooltip:syntheticData.weightedF1Score}Weighted F1 Score{/tooltip}`,
        disclosureProtectionTitle: 'Privacy metrieken',
        disclosureProtectionDescription: `De *onthullings beschermings metriek* meet het aandeel synthetische datapunten die te veel lijkt op echte datapunten (binnen een vooraf gedefinieerde drempelwaarde), wat een risico op herleidbaarheid naar persoonsgegevens vormt. Een lage 'risk_rate' en hoge 'disclosure_protection_rate' duidt op een goede bescherming tegen het onbedoeld prijsgeven van persoonsgegevens.`,
        outputDataTitle: '5. Download synthetische data en evaluatierapport',
        outputDataDescription: 'Preview van gegenereerde synthetische data:',
        moreInfoTitle: '6. Meer informatie',
        meanSquaredError:
            'Gemiddeld kwadraatverschil tussen voorspelde en werkelijke waarden, dat de nauwkeurigheid van de voorspellingen van een model kwantificeert door grotere fouten zwaarder te bestraffen',
        meanAbsoluteError:
            'Gemiddelde grootte van de fouten tussen voorspelde en werkelijke waarden, die een eenvoudige beoordeling van de nauwkeurigheid van het model biedt zonder de nadruk te leggen op grote fouten',
        R2: 'Kwantificeert hoe goed de voorspellingen van een model overeenkomen met de werkelijke gegevens door het aandeel van de variantie in de doelvariabele te meten dat door het model wordt verklaard',
        accuracyScore:
            'Meet het aandeel correct voorspelde gevallen ten opzichte van het totaal, en geeft zo een algemene beoordeling van de prestaties van het classificatiemodel',
        weightedF1Score:
            'Het harmonisch gemiddelde van precisie en recall, berekend per klasse en gewogen naar het aantal echte gevallen per klasse, wat een metriek biedt voor datasets met ongelijke klassenverdeling',
        correlationDifference: 'Correlatie verschil: {{correlationDifference}}',
        univariateText:
            '<br>Onderstaande figuren tonen de verdeling voor iedere variabele. De synthetische data is van hoge kwaliteit wanneer de verdelingen nagenoeg gelijk zijn.',
        bivariateText:
            'Onderstaande figuren tonen de verschillen distributies voor een combinatie van twee variabelen. Voor de vergelijking van twee categorische variabelen worden staafdiagrammen getoond. Voor de vergelijking van een numerieke en een categorische variabele wordt een zogenaamd [violin plot](https://en.wikipedia.org/wiki/Violin_plot) gebruikt. Voor de vergelijking van twee numerieke variabelen wordt een [LOESS-plot](https://en.wikipedia.org/wiki/Local_regression) gemaakt. Voor alle plots geldt: de synthetische data zijn van hoge kwaliteit wanneer de vormen van de distributies nagenoeg overeenkomen.',
        moreInfo:
            '&nbsp;&nbsp;\n  \n  \n  \nWil je meer weten over synthetische data?\n  \n  \n  \n- [python-synthpop op Github](https://github.com/NGO-Algorithm-Audit/python-synthpop)\n- [local-first web app op Github](https://github.com/NGO-Algorithm-Audit/local-first-web-tool/tree/main)\n- [Synthetische Data: wat, waarom en hoe?](https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/Synthetic_Data_Survey-24.pdf)\n- [Kennis Netwerk Synthetische Data](https://online.rijksinnovatiecommunity.nl/groups/399-kennisnetwerk-synthetischedata/welcome) (Nederlandse organisaties)\n- [Synthetische data portaal van DUO](https://duo.nl/open_onderwijsdata/footer/synthetische-data.jsp)\n- [CART: synthpop resources](https://synthpop.org.uk/resources.html)\n- [Gaussian Copula - Synthetic Data Vault](https://docs.sdv.dev/sdv)',
        missingData: `Voor {tooltip:syntheticData.missingDataMARTooltip}Missing At Random (MAR){/tooltip} en {tooltip:syntheticData.missingDataMNARTooltip}Missing Not At Random (MNAR){/tooltip} data, 
worden missende data vervangen voor schattingen. Voor {tooltip:syntheticData.missingDataMCARTooltip}Missing Completely At Random (MCAR){/tooltip} worden missende data verwijderd.\n \n Meer informatie over concepten MCAR, MAR en MNAR kan worden gevonden in het boek [Flexible Imputation of Missing Data](https://stefvanbuuren.name/fimd/sec-MCAR.html) van prof. Stef van Buuren, Universiteit Utrecht.`,
        missingDataMARTooltip: `**MAR (Missing At Random)**:
- De kans dat data ontbreken is gerelateerd aan de waargenomen gegevens, maar niet aan de ontbrekende gegevens zelf. Het ontbreken kan worden voorspeld door andere variabelen in de dataset;
- Voorbeeld: de testresultaten van studenten ontbreken, maar het ontbreken hangt samen met hun aanwezigheid;
- MAR data worden geschat`,
        missingDataMNARTooltip: `**MNAR (Missing Not At Random)**:
- De kans dat gegevens ontbreken is gerelateerd aan de ontbrekende gegevens zelf. Er is een systematisch patroon in het ontbreken dat verband houdt met de niet-waargenomen gegevens;
- Voorbeeld: patiënten met ernstigere symptomen rapporteren hun symptomen minder vaak, wat leidt tot ontbrekende gegevens die verband houden met de ernst van de symptomen;
- MNAR data worden geschat`,
        missingDataMCARTooltip: `**MCAR (Missing Completely At Random)**:
- De kans dat gegevens ontbreken is volledig onafhankelijk van zowel waargenomen als niet-waargenomen gegevens. Er is geen systematisch patroon in het ontbreken van de data;
- Voorbeeld: een enquêterespondent slaat een vraag over door een drukfout;
- MCAR data worden verwijderd`,
    },
    biasAnalysis: {
        dataSetPreview: {
            heading: '1. Preview van de data',
        },
        demo: {
            heading: 'Informatie over de demodataset',
            description: `Als voorbeeld wordt de [COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) dataset](https://github.com/propublica/compas-analysis/tree/master) gebruikt. De dataset bevat kenmerken van criminele verdachten en hun risico op recidive, zoals voorspeld door het COMPAS-algoritme. De dataset bevat demografische gegevens zoals leeftijd, geslacht en ras, evenals strafblad, details over de aanklacht en het voorspelde risicolabel. Deze dataset wordt gebruikt als benchmark voor onderzoek naar eerlijke algoritmes. Een beschrijving van alle variabelen is te vinden in onderstaande tabel.

**Beschrijving variabelen**

| Variabelenaam     | Beschrijving                                              | Waarden                                                                  |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| age_cat          | Leeftijdscategorie                                        | Jonger dan 25, 25-45, Ouder dan 45                                       |
| sex               | Geslacht                                                  | Man, Vrouw                                                               |
| race              | Ras                                                       | Afro-Amerikaans, Aziatisch, Kaukasisch, Latijns-Amerikaans, Inheems-Amerikaans, Overig    |
| c_charge_degree | Ernst van de strafrechtelijke aanklacht                   | M: Overtreding – Minder ernstige feiten, F: Misdrijf – Ernstigere feiten |
| is_recid         | Of de verdachte opnieuw de fout in ging (recidive)        | 0: Nee, 1: Ja                                                            |
| score_text       | Voorspeld risicolabel van de verdachte                    | 0: Geen hoog risico, 1: Hoog risico                                      |
| false_positive   | Verdachte voorspeld om te recidiveren, maar deed dat niet | 0: geen valspositieve, 1: valspositieve                              |

<br>

In dit voorbeeld analyseren welke groepen het COMPAS risicotaxatie-algoritme afwijkend presteert. Dit doen we door het clusteralgoritme toe te passen op de onderstaande dataset. De kolom "is_recid" geeft aan of een verdachte daadwerkelijk opnieuw de fout in ging (1: ja, 0: nee). De kolom "score_text" geeft aan of werd voorspeld dat een verdachte opnieuw de fout in zou gaan (1: ja, 0: nee). De kolom "false_positive" (FP) vertegenwoordigt gevallen waarin het algoritme voorspelde dat een verdachte opnieuw de fout in zou gaan, maar dit niet gebeurde (1: FP, 0: geen FP). Een voorbeeld van de data wordt hieronder gegeven. De kolom "false_positive" wordt gebruikt als bias variabele.
`,
        },
        testingStatisticalSignificance: `**5. Toetsen verschil cluster mbt. bias variabele**

- <i class="font-serif">H</i><sub>0</sub>: er is geen verschil in bias variabele tussen het meest afwijkende cluster en de rest van de dataset
- <i class="font-serif">H</i><sub>1</sub>: er is een verschil in bias variabele tussen het meest afwijkende cluster en de rest van de dataset

Er wordt een tweezijdige t-toets uitgevoerd om <i class="font-serif">H</i><sub>0</sub> te aanvaarden of te verwerpen.

{tooltip:biasAnalysis.p_valueTooltip}p-waarde{/tooltip} : {{p_val}}
        `,
        p_valueTooltip: `De p-waarde is de kans om de nulhypothese (H<sub>0</sub>) onterecht te verwerpen wanneer deze in werkelijkheid waar is. Een veelgebruikte drempelwaarde is p≤0,05, wat wordt beschouwd als een voldoende lage kans om H<sub>0</sub> te verwerpen en de alternatieve hypothese (H<sub>1</sub>) te accepteren.`,
        higherIsBetter: 'Hogere waarde van bias variabele is beter',
        lowerIsBetter: 'Lagere waarde van bias variabele is beter',
        parameters: {
            heading: '2. Geselecteerde hyperparameters',
            iterations: 'Aantal iteraties: {{value}}',
            minClusterSize: 'Minimale clustergrootte: {{value}}',
            performanceMetric: 'Bias variabele: {{value}}',
            performanceMetricTooltip:
                'De geselecteerde kolom wordt gebruikt om de bias te meten.',
            dataType: 'Gegevenstype: {{value}}',
            description: `- Aantal iteraties: {{iterations}}
- Minimale clustergrootte: {{minClusterSize}}
- Bias variabele: {{performanceMetric}}
- Gegevenstype: {{dataType}}
- Interpretatie van bias variabele: $t({{higherIsBetter}}) is better
`,
        },
        distribution: {
            mainHeading: '6. Verschil clusters mbt. eigenschappen',
            heading: '"{{variable}}" verdeling per cluster:',
        },
        splittingDataset: {
            heading: '3. Splitsen dataset',
            description: `Om de kans te verkleinen dat de clusteringmethode ruis detecteert, wordt de dataset opgesplitst in een trainingsset (80%) en een testset (20%). De clusteringmethode wordt eerst getraind op de trainingsset. Vervolgens wordt met behulp van de testset beoordeeld of er sprake is van een statistisch significant signaal in het meest afwijkende cluster.`,
        },
        distributionOfFeaturesAcrossClustersAccordeonTitle:
            'Eigenschappen per cluster',
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
                'Eigenschappen meest afwijkende cluster ten opzichte van de rest van de dataset',
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
                feature: '- {{feature}}',
                deviatingMoreOften: `  - **{{value}}** komt in de meest afwijkende cluster **vaker** voor dan in de rest van de dataset.`,
                deviatingLessOften: `  - **{{value}}** komt in de meest afwijkende cluster **minder** voor dan in de rest van de dataset.`,
            },
        },
        clusterinResults: {
            heading: '4. Cluster resultaten',
            description: `
- Aantal gevonden clusters: {{clusterCount}}
            `,
            label: 'Kies cluster om het aantal datapunten voor weer te geven',
            valueText:
                'Aantal datapunten in cluster {{index}}: {{value}} / {{totalRecords}}',
        },
        higherAverage: `Het meest afwijkende cluster heeft statistisch significant andere bias variabele dan de rest van de dataset.`,
        noSignificance: `Het meest afwijkende cluster heeft statistisch significant geen andere bias variabele dan de rest van de dataset.`,

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
