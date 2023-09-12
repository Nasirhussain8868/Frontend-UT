"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Selects from "@/components/Selects";
import Inputs from "@/components/Inputs";

const Update = () => {
  const retrievedObject = JSON.parse(localStorage.getItem("update"));
  const token = localStorage.getItem("token");
  const [isSuccess, setIsSuccess] = useState(false);
  console.log(retrievedObject);

  const options = {
    main_comments_scl20_fm8628_v89: [
      {
        value: "correct",
        label: "correct",
      },
      {
        value: "incorrect",
        label: "incorrect",
      },
      {
        value: "incomplete",
        label: "incomplete",
      },
      {
        value: "out of scope",
        label: "out of scope",
      },
      {
        value: "TBD",
        label: "TBD",
      },
    ],
    error_category: [
      {
        value: "incorrect_snapping_sign_proximity_elevation_ramp",
        label: "Incorrect Snapping of Sign - Proximity, Elevation, Ramp",
      },
      {
        value: "incorrect_snapping_sign_due_to_side_of_road",
        label: "Incorrect Snapping of Sign - Due to Side of Road",
      },
      {
        value: "incorrect_snapping_sign_due_to_incorrect_bearing",
        label: "Incorrect Snapping of Sign - Due to Incorrect Bearing",
      },
      {
        value: "incorrect_snapping_sign_topology_not_found",
        label: "Incorrect Snapping of Sign - Topology Not Found",
      },
      {
        value: "incorrect_snapping_sign_due_to_duplicate_sign",
        label: "Incorrect Snapping of Sign - Due to Duplicate Sign",
      },
      {
        value: "incorrect_snapping_sign_for_ramp_exits",
        label: "Incorrect Snapping of Sign - Signs Meant for Ramp/Exits",
      },
      {
        value: "missing_logical_sign",
        label: "Missing Logical Sign",
      },
      {
        value: "missing_road_sign",
        label: "Missing Road Sign",
      },
      {
        value: "vss_classified_as_regular_speedlimit",
        label: "VSS Classified as Regular Speed Limit",
      },
      {
        value: "regular_speedlimit_skipped_with_vss_condition",
        label: "Regular Speed Limit Skipped as VSS Condition Present",
      },
      {
        value: "vss_or_vsl_condition_wrong_in_core_map",
        label: "VSS or VSL Condition Wrong in Core Map",
      },
      {
        value: "sss_condition_wrong_in_core_map",
        label: "SSS Condition Wrong in Core Map",
      },
      {
        value: "false_sign_detection",
        label: "False Sign Detection",
      },
      {
        value: "sign_detection_of_values",
        label: "Sign Detection of Values",
      },
      {
        value: "incorrect_termination_temp_speed_limit",
        label:
          "Incorrect Termination - Temp Speed Limit Coded as Legal Speed Limit",
      },
      {
        value: "incorrect_termination_incorrect_classification",
        label: "Incorrect Termination - Incorrect Classification",
      },
      {
        value: "missing_logical_termination_sign",
        label: "Incorrect Termination - Missing Logical Termination Sign",
      },
      {
        value: "missing_road_termination_sign",
        label: "Incorrect Termination - Missing Road Termination Sign",
      },
      {
        value: "road_derivation_algorithm_processing",
        label: "Incorrect Termination – Road Derivation Algorithm Processing",
      },
      {
        value: "road_derivation_threshold_reached_sign_not_present",
        label:
          "Incorrect Termination – Road Derivation Threshold Reached when Sign Not Present",
      },
      {
        value: "road_derivation_threshold_reached_sign_present",
        label:
          "Incorrect Termination – Road Derivation Threshold Reached while Sign Present",
      },
      {
        value: "incorrect_termination_vss_in_path",
        label: "Incorrect Termination - VSS in Path",
      },
      {
        value: "incorrect_grouping_supplemental_info_sign",
        label: "Incorrect Grouping - Supplemental Info Sign (Pre-warning)",
      },
      {
        value: "incorrect_coding_missing_tile_or_tile_not_processed",
        label: "Incorrect Coding - Missing Tile or Tile Not Processed",
      },
      {
        value: "incorrect_grouping_incorrect_parent_child_relationship",
        label: "Incorrect Grouping - Incorrect Parent Child Relationship",
      },
      {
        value: "different_logical_sign_id_referencing_single_road_sign",
        label: "Different Logical Sign ID Referencing Single Road Sign ID",
      },
      {
        value: "incorrect_coding_incorrect_logical_road_sign_orientation",
        label: "Incorrect Coding - Incorrect Logical Road Sign Orientation",
      },
      {
        value: "coding_is_correct",
        label: "Coding is Correct",
      },
      {
        value: "out_of_scope_fc",
        label: "Out Of Scope FC",
      },
      {
        value: "mechanical_vss",
        label: "Mechanical VSS",
      },
      {
        value: "tmob_incorrect",
        label: "TMOB Incorrect",
      },
      {
        value: "terminating_at_ramp_merge",
        label: "Terminating at Ramp Merge",
      },
      {
        value: "missing_vss_in_core_map",
        label: "Missing VSS in Core Map",
      },
      {
        value: "incorrect_coding_missing_road_sign_in_scl_input",
        label: "Incorrect Coding - Missing Road Sign in SCL Input",
      },
      {
        value: "incorrect_grouping_two_parent_sign",
        label: "Incorrect Grouping - Two Parent Sign",
      },
    ],
  };
  const router = useRouter();
  const handleSubmit = async (values) => {
    const url = "http://127.0.0.1:8000/api/tickets-update";
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios
      .post(url, values,config)
      .then((response) => {
        setIsSuccess(false);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          router.push("/");
        }
        if (response.data.status === "failed") {
          Object.values(response.data.errors).forEach((error) => {
            toast.error(error[0]);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Toaster />
      {
        <section className="w-full h-screen flex justify-center py-10">
          <div className="lg:shadow-lg md:w-[800px] lg:p-20 lg:rounded-xl p-10">
            <h3 className="text-center pb-5 text-2xl uppercase font-semibold">
              Update Your Fields
            </h3>
            <Formik onSubmit={handleSubmit} initialValues={retrievedObject}>
              {({ values, setFieldValue }) => (
                <Form encType="multipart/form-data">
                  <div className="grid gap-6 gap-y-2 md:grid-cols-2">
                    <Selects
                      options={options.main_comments_scl20_fm8628_v89}
                      name="main_comments_scl20_fm8628_v89"
                      label="Add Main Comments *"
                      defaults={retrievedObject.main_comments_scl20_fm8628_v89}
                    />
                    <Selects
                      options={options.error_category}
                      name="error_category"
                      label="Sub Category *"
                      defaults={retrievedObject.error_category}
                    />
                    <Inputs
                      name="do_comments_observation"
                      label="DO Comments Observation *"
                    />
                    <Inputs
                      name="topology_id"
                      label="Topology Id *"
                    />
                    <Inputs
                      name="logical_sign_id"
                      label="Logical Sign ID *"
                    />
                    <Inputs name="observed_speedlimit" label="Observed Speedlimit *" />
                    <Inputs
                      name="expected_speedlimit"
                      label="Expected Speedlimit *"
                    />
                    <Inputs
                      name="dO_comment_expected"
                      label="DO Comment Expected *"
                    />
                    <Inputs
                      name="error_description"
                      label="Error Description *"
                    />
                  </div>

                  <div className="mt-14 text-center">
                    <button
                      type="submit"
                      disabled={isSuccess}
                      className={`${
                        isSuccess ? "bg-teal-100" : "bg-teal-500"
                      } p-3 px-14 text-white font-semibold rounded-full`}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      }
    </>
  );
};

export default Update;
