"use client";

import { useState, useEffect } from "react";
import { useAragon } from "../contexts/AragonContext";
import { DaoListItem } from "@aragon/sdk-client";
import { stringify } from "../utils/stringify";

export function DAOs() {
  const { baseClient } = useAragon();
  const [daos, setDaos] = useState<Array<DaoListItem> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (baseClient) {
      baseClient.methods
        .getDaos({ limit: 5 })
        .then((loadedDaos: Array<DaoListItem>) => {
          setDaos(loadedDaos);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading DAOs:", error);
          setLoading(false);
        });
    }
  }, [baseClient]);

  if (loading) {
    return <div>Loading DAOs...</div>;
  }

  if (!daos) {
    return <div>Error occurred while loading.</div>;
  }

  return (
    <div>
      {daos.map((dao, index) => (
        <div key={index}>
          <pre>{stringify(dao)}</pre>
        </div>
      ))}
    </div>
  );
}
