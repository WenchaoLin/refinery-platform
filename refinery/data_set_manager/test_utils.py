import json

from django.test.utils import override_settings

from core.models import DataSet
from data_set_manager.models import Assay, Node, Protocol, Study
from data_set_manager.tasks import parse_isatab
from data_set_manager.tests import MetadataImportTestBase
from data_set_manager.utils import ISAJSONCreator
from factory_boy.utils import create_dataset_with_necessary_models


def ordered(obj):
    if isinstance(obj, dict):
        return sorted((ordered(k), ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(ordered(x) for x in obj)
    else:
        return obj


@override_settings(CELERY_ALWAYS_EAGER=True)
class ISAJSONCreatorTests(MetadataImportTestBase):
    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        # Set up data for the whole TestCase
        parse_isatab(
            username="test",
            public=False,
            path="data_set_manager/test-data/BII-S-7.zip"
        )

        dataset = DataSet.objects.all().first()
        cls.isa_tools_json_creator = ISAJSONCreator(dataset)

        with open(
            "data_set_manager/test-data/isa-json/BII-S-7.json"
        ) as isa_json:
            cls.expected_isa_json = json.loads(isa_json.read())

    def setUp(self):
        super(ISAJSONCreatorTests, self).setUp()

    def test__create_comments(self):
        study = self.isa_tools_json_creator.studies.first()
        assay = Assay.objects.filter(study=study)
        nodes = self.isa_tools_json_creator.dataset.get_nodes(
            assay=assay, study=study, type=Node.RAW_DATA_FILE
        )

        self.assertEqual(
            self.isa_tools_json_creator._create_comments_from_node(
                node=nodes.first()
            ),
            [{"name": u"Export", "value": u"yes"}],
        )

    def test__create_datafiles(self):
        study = Study.objects.first()
        assay = Assay.objects.filter(study=study)

        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_datafiles(
                    assay=assay, study=study
                )
            ),
            ordered(
                self.expected_isa_json["studies"][0]["assays"][0]["dataFiles"]
            ),
        )

    def test__create_design_descriptors(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_design_descriptors(
                self.isa_tools_json_creator.studies.first()
            ),
            [
                {
                    "annotationValue": u"Metagenomics",
                    "termAccession": u"",
                    "termSource": u"",
                }
            ],
        )

    def test__create_factors(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_factors(
                self.isa_tools_json_creator.studies.first()
            ),
            [
                {
                    "@id": "#factor/diet",
                    "factorName": u"diet",
                    "factorType": {
                        "annotationValue": u"diet",
                        "termAccession": u"",
                        "termSource": u"",
                    },
                }
            ],
        )

    def test__create_factor_values(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_factor_values(
                self.isa_tools_json_creator.dataset.get_nodes().first()
            ),
            [
                {
                    "category": {"@id": "#factor/diet"},
                    "value": {
                        "annotationValue": u"vegeterian diet (derived from "
                        u"Sorghum, Millet, Black eyed pea)",
                        "termAccession": "",
                        "termSource": "",
                    },
                }
            ],
        )

    def test__create_id(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_id("id", "value"), "#id/value"
        )

    def test__create_id_replaces_spaces_with_underscores(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_id(
                "id", "value that has spaces"
            ),
            "#id/value_that_has_spaces",
        )

    def test__create_materials_assay(self):
        assay = Assay.objects.get(
            study=self.isa_tools_json_creator.studies.first()
        )
        self.assertEqual(
            ordered(self.isa_tools_json_creator._create_materials(assay)),
            ordered(
                self.expected_isa_json["studies"][0]["assays"][0]["materials"]
            ),
        )

    def test__create_materials_study(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_materials(
                    self.isa_tools_json_creator.studies.first()
                )
            ),
            ordered(self.expected_isa_json["studies"][0]["materials"]),
        )

    def test__create_characteristics_sample(self):
        node = Node.objects.filter(
            study=self.isa_tools_json_creator.studies.first(), type=Node.SAMPLE
        ).first()

        expected_characteristics = None
        for sample in self.expected_isa_json["studies"][0]["materials"][
            "samples"
        ]:
            if node.name in sample["@id"]:
                expected_characteristics = sample["characteristics"]
                break

        self.assertEqual(
            ordered(self.isa_tools_json_creator._create_characteristics(node)),
            ordered(expected_characteristics),
        )

    def test__create_characteristics_source(self):
        node = Node.objects.filter(
            study=self.isa_tools_json_creator.studies.first(), type=Node.SOURCE
        ).first()

        expected_characteristics = None
        for source in self.expected_isa_json["studies"][0]["materials"][
            "sources"
        ]:
            if node.name in source["@id"]:
                expected_characteristics = source["characteristics"]
                break

        self.assertEqual(
            ordered(self.isa_tools_json_creator._create_characteristics(node)),
            ordered(expected_characteristics),
        )

    def test__create_ontology_annotation(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_ontology_annotation(
                "term", "term_source", "term_accession"
            ),
            {
                "annotationValue": "term",
                "termSource": "term_source",
                "termAccession": "term_accession",
            },
        )

    def test__create_ontology_source_references(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator.
                _create_ontology_source_references()
            ),
            ordered(self.expected_isa_json["ontologySourceReferences"]),
        )

    def test__create_other_materials(self):
        study = Study.objects.first()
        assay = Assay.objects.filter(study=study)

        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_other_materials(
                    assay=assay
                )
            ),
            ordered(
                self.expected_isa_json["studies"][0]["assays"][0]["materials"][
                    "otherMaterials"
                ]
            )

        )

    def test__create_people(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_people(
                    self.isa_tools_json_creator.studies.first()
                )
            ),
            ordered(self.expected_isa_json["studies"][0]["people"])
        )

    def test__create_protocol_components(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_protocol_components(
                Protocol.objects.last()
            ),
            [
                {
                    "componentType": {
                        "annotationValue": u"DNA sequencer",
                        "termAccession": u"",
                        "termSource": u"",
                    },
                    "componentName": u"454 GS FLX Titanium",
                }
            ],
        )

    def test__create_protocol_parameters(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_protocol_parameters(
                Protocol.objects.last()
            ),
            [
                {
                    "parameterName": {
                        "annotationValue": u"sequencing instrument",
                        "termAccession": u"",
                        "termSource": u"",
                    },
                    "@id": "#parameter/sequencing_instrument",
                },
                {
                    "parameterName": {
                        "annotationValue": u"quality scorer",
                        "termAccession": u"",
                        "termSource": u"",
                    },
                    "@id": "#parameter/quality_scorer",
                },
                {
                    "parameterName": {
                        "annotationValue": u"base caller",
                        "termAccession": u"",
                        "termSource": u"",
                    },
                    "@id": "#parameter/base_caller",
                },
            ],
        )

    def test__create_protocols(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_protocols(
                    self.isa_tools_json_creator.studies.first()
                )
            ),
            ordered(self.expected_isa_json["studies"][0]["protocols"]),
        )

    def test__create_publications(self):
        self.assertEqual(
            self.isa_tools_json_creator._create_publications(
                self.isa_tools_json_creator.studies.first()
            ),
            self.expected_isa_json["studies"][0]["publications"],
        )

    def test__create_samples_assay(self):
        study = Study.objects.first()
        assay = Assay.objects.get(study=study)

        self.assertEqual(
            ordered(self.isa_tools_json_creator._create_samples(assay)),
            ordered(
                self.expected_isa_json["studies"][0]["assays"][0]["materials"][
                    "samples"
                ]
            ),
        )

    def test__create_samples_study(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_samples(
                    self.isa_tools_json_creator.studies.first()
                )
            ),
            ordered(
                self.expected_isa_json["studies"][0]["materials"]["samples"]
            ),
        )

    def test__create_sources(self):
        self.assertEqual(
            ordered(
                self.isa_tools_json_creator._create_sources(
                    self.isa_tools_json_creator.studies.first()
                )
            ),
            ordered(
                self.expected_isa_json["studies"][0]["materials"]["sources"]
            ),
        )

    def test__create_unit_categories(self):
        self.assertEqual(
            ordered(self.isa_tools_json_creator._create_unit_categories(
                self.isa_tools_json_creator.studies.first()
            )),
            ordered(self.expected_isa_json["studies"][0]["unitCategories"]),
        )

    def test_isa_tab_based_datasets_supported_only(self):
        non_isatab_dataset = create_dataset_with_necessary_models()
        with self.assertRaises(RuntimeError):
            ISAJSONCreator(non_isatab_dataset)


@override_settings(CELERY_ALWAYS_EAGER=True)
class ISATabExportIntegrationTests(MetadataImportTestBase):
    def test_bii_dataset_to_isa_json(self):
        self.maxDiff = None
        with open(self.get_test_file_path("BII-S-7.zip")) as good_isa:
            self.post_isa_tab(isa_tab_file=good_isa)

        dataset = DataSet.objects.all().first()
        ISAJSONCreator(dataset).create()